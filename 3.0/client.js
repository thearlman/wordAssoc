console.log(`
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
                  Welcome Home!
This little website uses vis.js https://visjs.org/
and dataMuse https://www.datamuse.com/api/
My name is Asa, and I like to make things.
You can find me at: https://asas.website/
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

`);

document.getElementById('submit').onclick = submitTags;
document.getElementById('submitDemo').onclick = () => {
  tags = tagsDemo;
  tagAssociations = tagAssociationsDemo;
  createNetwork();
};

let nodes = [];
let network;
let tags = [];
let tagAssociations = {};

function submitTags() {
  event.preventDefault();
  let tempWord = "";
  let allTags = document.getElementById("userTags").value;
  if (allTags.length > 0) {
    tagCount = allTags.length;
    console.log("submitted");
    for (var i = 0; i < allTags.length; i++) {
      if (allTags[i] === " " && allTags[i - 1] === ",") {
        null;
      } else if (allTags[i] != ",") {
        tempWord += allTags[i];
      } else {
        tags.push(tempWord);
        tempWord = "";
      }
      if (i === allTags.length - 1) {
        tags.push(tempWord);
        tempWord = "";
        // i++;
      }
    }
    callApi();
    console.log("called");
  } else {
    document.getElementById('userTags').classList.add('bad-input');
    document.getElementById('userTags').placeholder = "Please enter one or more keywords seperated by a comma";
    return;
  }
}

function callApi() {
  let tagCount = 0;
  let numTags = tags.length;
  tags.forEach((tag, i) => {
    let request = new XMLHttpRequest();
    request.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        console.log(this.readyState);
        if (JSON.parse(request.responseText).length > 0) {
          tagAssociations[tag] = [];
          tags.push(tag);
          let associativeKeywords = JSON.parse(request.responseText);
          associativeKeywords.forEach((item, i) => {
            tagAssociations[tag].push(item.word);
          });
          tagCount++;
          console.log(`num Tags: ${numTags}, tagCount: ${tagCount}`);
          if (numTags === tagCount) {
            createNetwork();
          }
        } else {
          // console.log("nothing found for");
          // console.log(request.responseText);
        }
      } else {
        // console.log(request.responseText);
      }
    }
    setTimeout(() => {
      request.open('GET', `https://api.datamuse.com/words?ml=${tagFormatter(tag)}`);
      request.send();
    }, 50);
  });
  tags = [];
}

function tagFormatter(tag) {
  let formattedTag = "";
  for (let i = 0; i < tag.length; i++) {
    if (tag[i] != " ") {
      formattedTag += tag[i];
    } else {
      formattedTag += "+";
    }
  };
  return formattedTag;
}

function createNetwork() {
  tags.forEach((item, i) => {
    nodes.push({
      id: i,
      label: item
    });
  });

  // create a network
  let container = document.getElementById('mynetwork');
  container.style.display = "unset";
  document.getElementById('userTags').remove();
  document.getElementById('submit').remove();
  document.getElementById('submitDemo').remove();
  let data = {
    nodes: nodes,
    // edges: edges
  };
  let options = {
    physics: {
      stabilization: {
        iterations: 10,
      },
      timestep: .3,
      adaptiveTimestep: true,
      barnesHut: {
        gravitationalConstant: -3500,
        springLength: 10,
        springConstant: .01,
        avoidOverlap: .7
      }
    },
    layout: {
      improvedLayout: false,
    },
    nodes: {
      font: {
        size: 22
      },
      shape: "circle",
      margin: 10,
      color: {
        border: '#000000',
        background: '#377EB8',
        highlight: {
          border: '#000000',
          background: '#4CAF4A'
        },
        hover: {
          border: '#2B7CE9',
          background: '#D2E5FF'
        }
      },
    }
  };
  network = new vis.Network(container, data, options);
  network.on("click", function(properties) {
    // console.log(properties.nodes[0]);
    (typeof properties.nodes[0] !== "undefined") ?
    makeConnections(properties.nodes[0]):
      console.log("nope");

  })
}

// createNetwork();

function makeConnections(nodeNumber) {
  // console.log(nodeNumber);
  let matchingTags = {};
  let selectedTag = tags[nodeNumber];
  tags.forEach((tag, i) => {
    matchingTags[tag] = [];
    if (tag !== selectedTag) {
      tagAssociations[selectedTag].forEach((selTagAssoc, e) => {
        tagAssociations[tag].forEach((tagAssoc, f) => {
          if (selTagAssoc === tagAssoc) {
            matchingTags[tag].push(tagAssoc);
          }
        });
      });
    }
  });
  drawConnections(nodeNumber, matchingTags);
}

function drawConnections(nodeNumber, matchingTags) {
  removeAllEdges();
  for (var i = 0; i < Object.keys(matchingTags).length; i++) {
    let tag = Object.keys(matchingTags)[i];
    if (matchingTags[tag].length > 0) {
      network.body.data.edges.add([{
        from: nodeNumber,
        to: i
      }]);
      let tagList = "";
      matchingTags[tag].forEach((item, i) => {
        tagList += item + "<br>";
      });
      network.body.nodes[i].options.title = tagList;
    }
  }
}

function removeAllEdges() {
  network.body.data.edges.forEach((item, i) => {
    network.body.data.edges.remove([i]);
  });


}
