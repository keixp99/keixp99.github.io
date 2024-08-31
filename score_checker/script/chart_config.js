import { titleWithDifficulty } from "./common.js";

function generateChartConfig(scores) {
    let count_acc = []; //accracies
    let song_acc = [];
    for (const score of scores) {
        count_acc[score.score_below_max] = (count_acc[score.score_below_max] || 0) + 1;
        if (song_acc[score.score_below_max] === undefined) {
            song_acc[score.score_below_max] = [titleWithDifficulty(score)];
        } else {
            song_acc[score.score_below_max].push(titleWithDifficulty(score));
        }
    }
    //console.log(song_acc);
    //count_accはsparse array だけど、このままグラフつくってもうまく表示できる
    const cfg = {
        type: "bar",
        data: {
            labels: [...Array(count_acc.length).keys()], //[0,1,…,accracies.length-1] という配列をつくる
            datasets: [{
                data: count_acc,
                barPercentage: 1.0, //棒の横幅
                label: "# of charts",
                hoverBackgroundColor: '#ffa6f2',
            }]
        },
        options: {
            //y 軸の設定
            scales: {
                y: {
                    ticks: {
                        stepSize: 1
                    }
                }
            },
            //表示アニメーションを無効化
            animation: {
                duration: 0
            },
            //親のdivのサイズに応じてchartサイズを変化 https://www.chartjs.org/docs/latest/configuration/responsive.html
            responsive:true,
            maintainAspectRatio: false,
            plugins: {
                //ホバーしたときに表示される黒いやつの設定
                tooltip: {
                    callbacks: {
                        title: ((item) => `MAX-${item[0].dataIndex}: ${item[0].formattedValue}`),
                        label: ((item) => song_acc[item.dataIndex])
                    }
                }
            }
        }
    };
    return cfg;
}
export {generateChartConfig};