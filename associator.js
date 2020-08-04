console.log("ready");

// let tagAssociations = {};
//
// //populate an object with all of the tags and thier associative words
// tags.forEach((tag, index) => {
//   requestAssociations(tag, function(keywordArray){
//     tagAssociations[tag] = keywordArray;
//   });
// });

let matchingItems = {};

//populate the screen with elements containing the tags
tags.forEach((item, i) => {
  let keyword = document.createElement('div');
  keyword.classList.add('keyword');
  keyword.innerHTML = item;
  document.getElementById('main-cont').appendChild(keyword);
  keyword.addEventListener('click', makeConnections);
});


function requestAssociations(keyword, callback) {
  let request = new XMLHttpRequest();
  request.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      let associativeKeywords = JSON.parse(request.responseText);
      let keywordArray = [];
      associativeKeywords.forEach((item, i) => {
        keywordArray.push(item.word);
      });
      callback(keywordArray);
    } else {
      // console.log(request.responseText);
    }
  }
  request.open('GET', `http://api.datamuse.com/words?ml=${keywordFormatter(keyword)}`);
  request.send();
}


function keywordFormatter(keyword) {
  let keywordFormatted = "";
  for (let i = 0; i < keyword.length; i++) {
    if (keyword[i] != " ") {
      keywordFormatted += keyword[i];
    } else {
      keywordFormatted += "+";
    }
  };
  return keywordFormatted;
}

function makeConnections() {
  event.target.style.background = "green";
  let matchingKeywords = [];
  let selectedKeyword = event.target.innerHTML;
  tags.forEach((keyword, i) => {
    matchingItems[keyword] = [];
    if (keyword !== selectedKeyword) {
      tagAssociations[selectedKeyword].forEach((item1, i) => {
        tagAssociations[keyword].forEach((item2, i) => {
          if (item1 === item2) {
            matchingItems[keyword].push(item2);
            drawConnection(selectedKeyword, keyword);
          };
        });
      });
    }
  });
}

function drawConnection(selectedKeyword, keyword) {
  document.getElementById('main-cont').childNodes.forEach((item, i) => {
    if(item.innerHTML === keyword){
      item.style.background = "red";
      let associations = document.createElement('div');
      let popup = item.addEventListener("mouseenter", function(){
        associations.innerHTML = matchingItems[item.innerHTML];
        associations.classList.add('association');
        document.getElementById('main-cont').appendChild(associations);
        associations.style.left = event.clientX + "px";
        associations.style.top = event.clientY + "px";
      })
      item.addEventListener("mouseleave", function(){
        associations.remove();
      })
    }
  });
}

document.addEventListener("keyup", function(){
  if(event.key === "Escape"){
    window.location.reload();
    console.log("hello");
  }
})
