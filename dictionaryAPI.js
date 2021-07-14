const API_KEY = "92C0B84DA1D482228A32C1DF14058597"
const inputWord =  document.querySelector(".inputWord");
const word = inputWord.querySelector("input");
const replay = document.querySelector(".replay");
const dictWord = document.querySelector(".dictWord");
let nextLastLetter = '';


function getWord(lastLetter) {
    fetch(`https://stdict.korean.go.kr/api/search.do?key=${API_KEY}&q=${lastLetter}&advanced=y&pos=1&num=20&method=start&type1=word&letter_s=2&letter_e=6`)
    .then(res => res.text())
    .then(data => {
        const parser = new DOMParser();
        const xml = parser.parseFromString(data, "text/xml");

        const rndNum = Math.floor(Math.random() *  20);

        if (xml.getElementsByTagName("total")[0].textContent === '0') {
            alert("승리하셨습니다!");
        } else {
            const nextWord = xml.getElementsByTagName("word")[rndNum].textContent.replace("-", "");
            dictWord.innerText = nextWord;
            
            nextLastLetter = nextWord[nextWord.length-1]; // 사전에서 가져온 뒷 글자.
            
        }
    })
    
}

function handleFetch(sendWord) {
    const search = sendWord;
    fetch(`https://stdict.korean.go.kr/api/search.do?key=${API_KEY}&q=${search}&advanced=y&pos=1`)
        .then(res => res.text())
        .then(data => {
            const parser = new DOMParser(); //텍스트 구문 분석
            const xml = parser.parseFromString(data, "text/xml");

            if (xml.getElementsByTagName("total")[0].textContent === '0') {
                alert("사전에 단어가 없습니다.");
                word.disabled = true;
            } else {
                const userWord = xml.getElementsByTagName("word")[0].textContent;  // 사용자 입력 단어 저장
                const lastLetter = userWord[userWord.length-1];
                getWord(lastLetter);
            }
        })
        .catch(console.error);

}


function handleReplay() {
    nextLastLetter = '';
    dictWord.innerText = '단어를 입력해주세요.';
    word.disabled = false;
}

function handleInputWord(event) {
    event.preventDefault();
    const sendWord = word.value;

    if (nextLastLetter.length > 0 && nextLastLetter !== sendWord[0]) {
        alert("끝말잇기가 안 됩니다.");
    } else {
        word.value = "";
        handleFetch(sendWord);

    }
}

replay.addEventListener("click", handleReplay);
inputWord.addEventListener("submit", handleInputWord);