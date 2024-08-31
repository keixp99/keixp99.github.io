javascript: {
    const overlay_style = document.createElement("link");
    overlay_style.rel = "stylesheet";
    overlay_style.href = "https://keixp99.github.io/score_checker/style/overlay_style.css";

    const style = document.createElement("link");
    style.rel = "stylesheet";
    style.href = "https://keixp99.github.io/score_checker/style/style.css";

    const block_logo = document.createElement("link");
    block_logo.rel = "stylesheet";
    style.href = "https://keixp99.github.io/score_checker/style/block_logo.css"

    const button = `<button id="show-overlay">overlay</button>`;
    const html =
        `<div id="myNav" class="overlay">
        <a href="javascript:void(0)" class="closebtn">&times;</a>
        <div class="overlay-inner">
            <div class="overlay-content">
                <div>
                    <button class="button-1" id="update-menu-open-button">Update</button>
                </div>
                <div class="update-menu">
                    <div class="update-start">
                        <div class="update-config">
                            <label><input type="checkbox" class="update-checkbox" data-diff="0">PST</label>
                            <label><input type="checkbox" class="update-checkbox" data-diff="1">PRS</label>
                            <label><input type="checkbox" class="update-checkbox" data-diff="2">FTR|ETR</label>
                            <label><input type="checkbox" class="update-checkbox" data-diff="3">BYD</label>
                        </div>
                        <div class="update-menu-buttons">
                            <button class="button-1" id="update-start-button">Start</button>
                            <button class="button-2" id="update-cancel-button">Cancel</button>
                        </div>
                    </div>
                    <div class="update-progress">
                    </div>
                    <div class="update-finished">
                        <div class="update-menu-buttons">
                            <button class="button-2" id="update-ok-button">OK</button>
                        </div>
                    </div>
                </div>
                <div class="tabs">
                    <div class="tab" data-tab="0">PST</div>
                    <div class="tab" data-tab="1">PRS</div>
                    <div class="tab active" data-tab="2">FTR|ETR</div>
                    <div class="tab" data-tab="3">BYD</div>
                    <div class="tab" data-tab="custom">custom</div>
                </div>
                <div class="custom-checkboxes">
                    <label><input type="checkbox" class="custom-checkbox" data-diff="0">PST</label>
                    <label><input type="checkbox" class="custom-checkbox" data-diff="1">PRS</label>
                    <label><input type="checkbox" class="custom-checkbox" data-diff="2">FTR|ETR</label>
                    <label><input type="checkbox" class="custom-checkbox" data-diff="3">BYD</label>
                </div>


                <div class="tab-content" id="tab-content-0">
                    <canvas id="chart-0"></canvas>
                </div>
                <div class="tab-content" id="tab-content-1">
                    <canvas id="chart-1"></canvas>
                </div>
                <div class="tab-content active" id="tab-content-2">
                    <canvas id="chart-2"></canvas>
                </div>
                <div class="tab-content" id="tab-content-3">
                    <canvas id="chart-3"></canvas>
                </div>
                <div class="tab-content" id="tab-content-custom">
                    <canvas id="chart-custom"></canvas>
                </div>


            </div>
        </div>
    </div>`;

    const chartjs = document.createElement("script");
    chartjs.src = "https://cdn.jsdelivr.net/npm/chart.js";

    const script = document.createElement("script");
    script.type = "module";
    script.src = "https://keixp99.github.io/score_checker/script/overlay_menu.js";
    if (document.querySelectorAll('#show-overlay').length >= 1) {
        window.alert("already created nav button");
    } else {
        window.alert("injection start");
        document.querySelector("head").appendChild(overlay_style);
        document.querySelector("head").appendChild(style);
        document.querySelector("head").appendChild(block_logo);
        document.querySelector("body").insertAdjacentHTML("afterbegin", button);
        /*stack contextの競争ではあとのほうが上になるらしい。https://ics.media/entry/200609/ 効いてるのかは知らん。*/
        document.querySelector("body").insertAdjacentHTML("beforeend", html);
        /*insertAdjacentHTMLではscriptを挿入しても実行されない
        https://stackoverflow.com/questions/57209520/script-injected-with-insertadjacenthtml-does-not-execute*/
        document.querySelector("body").appendChild(chartjs);
        document.querySelector("body").appendChild(script);
    }
    undefined;
}