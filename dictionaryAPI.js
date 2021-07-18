const API_KEY = "84A5A9B98255FA716EE81428E9A75F12"
const inputWord =  document.querySelector(".inputWord");
const word = inputWord.querySelector("input");
const replay = document.querySelector(".replay");
const dictWord = document.querySelector(".dictWord");
const meaning = inputWord.querySelector(".meaning");
const message = inputWord.querySelector(".message");
let nextLastLetter = '';

// 다음 단어 get
function getWord(lastLetter) {
    fetch(`https://word-chain-game.herokuapp.com/https://opendict.korean.go.kr/api/search?key=${API_KEY}&q=${lastLetter}&advanced=y&pos=1&num=15&method=start&type1=word&letter_s=2&letter_e=6&sort=popular`)
    .then(res => res.text())
    .then(data => {
        const parser = new DOMParser();
        const xml = parser.parseFromString(data, "text/xml");
        
        // 단어 검색
        if (xml.getElementsByTagName("total")[0].textContent === '0') {
            alert("승리하셨습니다!");
            word.disabled = true;
        } else {
            const countWord = xml. getElementsByTagName("word"); 
            const rndNum = Math.floor(Math.random() *  countWord.length); // 랜덤 값
            const nextWord = countWord[rndNum].textContent.replace("-", "");
            const definition = xml.getElementsByTagName("definition")[rndNum].textContent;
            dictWord.innerText = nextWord; // 단어 표시
            meaning.innerText = definition; // 의미 표시
            meaning.classList.remove("hidden");
            
            nextLastLetter = nextWord[nextWord.length-1]; // 사전에서 가져온 뒷 글자 저장
            
        }
    })
}

// 입력한 단어 사전 등재 여부 검사
function handleFetch(sendWord) {
    const search = sendWord;
    fetch(`https://word-chain-game.herokuapp.com/https://opendict.korean.go.kr/api/search?key=${API_KEY}&q=${search}&advanced=y&pos=1`)
        .then(res => res.text())
        .then(data => {
            const parser = new DOMParser(); //텍스트 구문 분석
            const xml = parser.parseFromString(data, "text/xml");

            if (xml.getElementsByTagName("total")[0].textContent === '0') {
                alert("게임 종료(사전에 단어가 없습니다.)");
                word.disabled = true; // 게임 종료
            } else {
                const userWord = xml.getElementsByTagName("word")[0].textContent;  // 사용자 입력 단어 저장
                const lastLetter = userWord[userWord.length-1]; // 마지막 단어 추출
                getWord(lastLetter); // 사용자 마지막 단어로 다음 단어 가져오기 요청
            }
        })
        .catch(console.error);

}

// 다시 시작하기
function handleReplay() {
    // 모든 ineerText 원상 복귀
    nextLastLetter = '';
    dictWord.innerText = 'Word';
    word.value = null;
    meaning.classList.add("hidden");
    message.classList.add("hidden");
    word.disabled = false;
}

function handleInputWord(event) {
    event.preventDefault();
    message.classList.add("hidden"); // 에러메시지 hidden
    const sendWord = word.value;

    // 단어 앞, 뒤 일치 검사
    if (nextLastLetter.length > 0 && nextLastLetter !== sendWord[0]) {
        message.innerText = "끝말잇기가 안 됩니다.";
        message.classList.remove("hidden");
    } else if (!(sendWord.length >= 2 && sendWord.length <= 6)){
        message.innerText = "2글자 ~ 6글자 내 단어를 입력하세요.";
        message.classList.remove("hidden");
    } 
    else {
        word.value = "";
        handleFetch(sendWord); // 입력한 단어 사전 등재 여부 검사
    }
}

replay.addEventListener("click", handleReplay); // 다시 시작하기
inputWord.addEventListener("submit", handleInputWord);