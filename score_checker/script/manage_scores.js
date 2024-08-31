'use strict';

import { isValidLocation } from "./common.js";

/*スコアを必要な分だけ取得し更新するプログラム difficulty 0,1,2,3を受け取る*/
async function updateScore(difficulty,progressOutput) {
    const diff_to_name = ["PST", "PRS", "FTR|ETR", "BYD"];
    progressOutput(`start updating ${diff_to_name[difficulty]}`);
    try {
        progressOutput("reading saved scores");
        const bookmarklet_txt = localStorage.getItem("bookmarklet_score");
        let old_scores, last_upscore_date;
        /*最終更新日時を取得。ない場合は0 */
        if (bookmarklet_txt === null) {
            /*bookmarklet_scoreが空。その場合は全部取得するしかない*/
            progressOutput("scores not saved; fetching all");
            last_upscore_date = 0;
            old_scores = [[], [], [], []]; /*PST,PRS,FTR&ETR,BYD ぜんぶ空*/
        } else {
            old_scores = JSON.parse(bookmarklet_txt);
            if (old_scores[difficulty].length === 0) {
                progressOutput("scores not saved; fetching all");
                last_upscore_date = 0;
            } else {
                last_upscore_date = parseInt(old_scores[difficulty][0].time_played); /*unix time*/
                progressOutput(`last upscore saved: ${new Date(last_upscore_date * 1000)}`);
            }
        }

        /*新しいスコアを取得*/
        let upscores = [];
        fetching_scores: for (let page_num = 1; ; page_num++) {
            progressOutput(`requesting page ${page_num}`);
            const page = await fetchJson(page_num, difficulty);
            for (const item of page.value.scores) {
                if (item.time_played <= last_upscore_date) {
                    /*すでに過去のスコアのみ*/
                    progressOutput("fetching scores finished");
                    break fetching_scores;
                }
                upscores.push(item);
            }
            if (page_num * 10 >= page.value.count) {
                /*最後まで行った。これ以上リクエストしても無駄 */
                progressOutput("reached the end");
                break fetching_scores;
            }
            /*3秒まつ*/
            progressOutput("pause between the requests (3 sec)");
            await new Promise(resolve => setTimeout(resolve, 3000));
        }
        progressOutput("saving new scores");
        let new_scores = JSON.parse(JSON.stringify(old_scores)); /*deep_copy*/
        /*塗り替えられたスコアを消す*/
        for (item of upscores) {
            new_scores[difficulty] = new_scores[difficulty].filter((e) => e.song_id !== item.song_id);
        }
        /*新しいスコアを追加*/
        new_scores[difficulty] = upscores.concat(new_scores[difficulty]);
        console.log(new_scores[difficulty]);
        /*これにより新しい順も保たれる*/

        localStorage.setItem("bookmarklet_score", JSON.stringify(new_scores));
        progressOutput("update finished");
    } catch (error) {
        progressOutput(error);
        throw new Error(error);
    }
}

async function deleteScore(difficulty) {
    if (difficulty === "all") {
        localStorage.removeItem("bookmarklet_score");
    } else if (difficulty < 0 || 3 < difficulty) {
        throw new Error(`in deleteScore: invalid difficulty:${difficulty}`);
    } else {
        const bookmarklet_txt = localStorage.getItem("bookmarklet_score");
        if (bookmarklet_txt === null) {
            /*bookmarklet_scoreが空。何もしない*/
            return 1;
        } else {
            let bookmarklet_score = JSON.parse(bookmarklet_txt);
            bookmarklet_score[difficulty] = [];
            localStorage.setItem(JSON.stringify(bookmarklet_score));
            return 0;
        }
    }
}

async function fetchJson(page, difficulty) {
    if (!isValidLocation()) {
        throw new Error("in fetchJson: invalid location; Requests will be denied");
    }
    const url = `https://webapi.lowiro.com/webapi/score/song/me/all?difficulty=${difficulty}&page=${page}&sort=date&term=`;
    try {
        console.log(`sending a request "difficulty=${difficulty}&page=${page}&sort=date&term="`);
        const response = await fetch(url, {
            credentials: 'include',
            headers: {
                Accept: "application/json, text/plain, */*"
            }
        });
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        console.log("responded");
        const json = await response.json();
        if (!json.success) {
            throw new Error(`lowiro rejected; error_code:${json.error_code}`);
        }
        if (json.value.scores.length === 0) {
            console.warn("empty scores");
        }
        return json;
    } catch (error) {
        console.error(error);
        throw new Error(error);
    }
}

export {updateScore, deleteScore};