// 初期化
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = 'ja-JP';
recognition.interimResults = true;
recognition.continuous = true;

const startButton = document.getElementById('start-btn');
const youText = document.getElementById('you-text');
const answerText = document.getElementById('answer-text');

let isRecognizing = false; // フラグを追加

// 音声認識開始
window.onload = () => {
    startButton.addEventListener('click', () => {
        if (startButton.dataset.status == 'start') {
            recognition.stop();
            startButton.innerText = '音声認識スタート';
            startButton.dataset.status = 'stop';
            isRecognizing = false; // フラグをリセット
        } else if (startButton.dataset.status == 'stop') {
            recognition.start();
            startButton.innerText = '音声認識ストップ';
            startButton.dataset.status = 'start';
            isRecognizing = true; // フラグを設定
        }
    });
    console.log('ページロード完了');
};

// 認識した音声の結果を処理するイベントハンドラー
recognition.onresult = (event) => {
    console.log('Start');
    for (let i = event.resultIndex; i < event.results.length; i++) {
        let results = event.results;
        if (results[i].isFinal) {
            console.log('解析終了');
            setRecognizedText(event.results[i][0].transcript);
        }
    }
};

function setRecognizedText(text) {
    console.log('You =>', text);

    var you = text.replace(/\s+/g, ''); // 空白を除去
    var answer = '';
    if (text.match('今日の天気は')) {
        answer = '今日の天気は、晴れ時々曇りです。';
    } else if (text.match('元気ですか')) {
        answer = '元気でーーーーす！！';
    } else if (text.match('ねえ') && text.match('Alexa')) {
        answer = '私はアレクサではありません。(−_−＃)';
    }

    youText.textContent = '' + you;
    answerText.textContent = '' + answer;
}

// エラーハンドラー
recognition.onerror = (event) => {
    console.error('エラーが発生しました:', event);
    
    // エラーが発生した場合、遅延を設けて再開
    if (isRecognizing) {
        recognition.stop();
        isRecognizing = false; // フラグをリセット
        
        setTimeout(() => {
            recognition.start();
            isRecognizing = true; // フラグを再設定
            console.log('音声認識が再開されました');
        }, 500); // 遅延時間を設定
    }
};
