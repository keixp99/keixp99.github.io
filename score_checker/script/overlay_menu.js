'use strict';
import { generateChartConfig } from "./chart_config.js";
import { updateScore, deleteScore } from "./manage_scores.js";

//overlayの設定
document.getElementById("show-overlay").onclick = () => {
    document.getElementById("myNav").style.height = "100%";
};
document.querySelector('a.closebtn').onclick = function () {
    document.getElementById("myNav").style.height = "0%";
}

//スコア更新メニューの設定
document.getElementById("update-menu-open-button").onclick = () => {
    document.querySelector('.update-menu').classList.add("active");
    document.querySelector('.update-start').classList.add("active");
    document.getElementById("update-menu-open-button").disabled = true;
}
document.getElementById("update-cancel-button").onclick = () => {
    document.querySelector('.update-start').classList.remove("active");
    document.querySelector('.update-menu').classList.remove("active");
    document.getElementById("update-menu-open-button").disabled = false;
}
document.getElementById("update-start-button").onclick = async () => {
    document.querySelector('.update-start').classList.remove("active");
    let diff_to_update = [];
    document.querySelectorAll('.update-checkbox').forEach((checkbox) => {
        if (checkbox.checked) {
            diff_to_update.push(checkbox.dataset.diff);
        }
    });
    //アップデート開始
    //まずprogressを掃除する
    document.querySelector('.update-progress').innerHTML = "";
    document.querySelector('.update-progress').classList.add("active");
    const progressOutput = ((string) => {
        document.querySelector('.update-progress').insertAdjacentHTML("beforeend", `${string}<br>`);
    });
    try {
        for (let i of diff_to_update) {
            await updateScore(i, progressOutput);
            progressOutput("pause between the requests (3 sec)");
            await new Promise(resolve => setTimeout(resolve, 3000));
        }
        //グラフ再描画
        destroyAllCharts();
        loadCharts();
    } catch (error) {
        progressOutput(`${error}; aborted`);
    }
    //終了画面へ
    document.querySelector('.update-finished').classList.add("active");
}
document.getElementById("update-ok-button").onclick = () => {
    document.querySelector('.update-progress').classList.remove("active");
    document.querySelector('.update-finished').classList.remove("active");
    document.querySelector('.update-menu').classList.remove("active");
    document.getElementById("update-menu-open-button").disabled = false;
}

async function updateScore_dummy(difficulty, progressOutput) {
    const diff_to_name = ["PST", "PRS", "FTR|ETR", "BYD"];
    progressOutput(`start updating ${diff_to_name[difficulty]}`);
    await new Promise((resolve) => { setTimeout(resolve, 3000) });
    console.log("done");
}

//タブの表示設定
document.querySelectorAll('.tab').forEach((element) => {
    element.onclick = (function () {
        //アロー関数をつかうとthisがかわるので注意
        const to_show = this.dataset.tab;

        document.querySelectorAll('.tab').forEach((content) => {
            content.classList.remove("active");
        })
        this.classList.add("active");

        if (to_show === "custom") {
            document.querySelector(".custom-checkboxes").classList.add("active");
        } else {
            document.querySelector(".custom-checkboxes").classList.remove("active");
        }

        document.querySelectorAll('.tab-content').forEach((content) => {
            content.classList.remove("active");
        })
        document.getElementById(`tab-content-${to_show}`).classList.add("active");
    });
});

//グラフを表示
loadCharts();


async function loadCharts() {
    //localstorageからスコアを取得
    const bookmarklet_txt = localStorage.getItem("bookmarklet_score");
    //スコアがlocalStorageにない場合は空列(PST,PRS,FTR|ETR,BYD 空)にする
    const score_list = (bookmarklet_txt === null) ? [[],[],[],[]] : JSON.parse(bookmarklet_txt);

    //グラフの設定
    //chart of PST,PRS,FTR|ETR,BYD
    const charts = [, , ,];
    for (let difficulty = 0; difficulty < 4; difficulty++) {
        let list_by_diff;
        list_by_diff = score_list[difficulty].filter((item) => { return item.score >= 10000000 });
        const cfg = generateChartConfig(list_by_diff);
        charts[difficulty] = new Chart(document.getElementById(`chart-${difficulty}`), cfg);
    }
    //custom chart
    let custom_chart = new Chart(document.getElementById("chart-custom"));
    document.querySelectorAll('.custom-checkbox').forEach((item) => {
        item.onclick = function () {
            //チェックされている難易度を取得
            const checked_list = [0, 1, 2, 3].filter((i) => document.querySelector(`.custom-checkbox[data-diff="${i}"]`).checked);
            console.log(checked_list);
            //それだけあつめてcustom_listをつくる
            let custom_list = [];
            for (let difficulty of checked_list) {
                let list_by_diff;
                list_by_diff = score_list[difficulty].filter((item) => { return item.score >= 10000000 });
                custom_list = custom_list.concat(JSON.parse(JSON.stringify(list_by_diff)));
            }
            console.log(custom_list);
            const cfg = generateChartConfig(custom_list);
            // グラフを更新
            custom_chart.destroy();
            custom_chart = new Chart(document.getElementById("chart-custom"), cfg);
        }
    })
}

function destroyAllCharts() {
    //canvasを強制的に削除してつくりなおす 外からだとこの方法しかない
    for (let i of [0, 1, 2, 3, "custom"]) {
        document.getElementById(`chart-${i}`).remove();
        document.getElementById(`tab-content-${i}`).innerHTML = `<canvas id="chart-${i}"></canvas>`;
    }
    //もう一度loadCharts()する必要がある
}