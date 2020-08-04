console.log("loaded");

// let nodes = new vis.DataSet([]);
// let edges = new vis.DataSet([]);

let nodes = [];
let network;

function createNetwork() {
  tags.forEach((item, i) => {
    nodes.push({
      id: i,
      label: item
    });
  });


  // // create an array with edges
  // let edges = new vis.DataSet([
  //   {from: 1, to: 3},
  //   {from: 1, to: 2},
  //   {from: 2, to: 4},
  //   {from: 2, to: 5},
  //   {from: 3, to: 3}
  // ]);

  // create a network
  let container = document.getElementById('mynetwork');
  let data = {
    nodes: nodes,
    // edges: edges
  };
  let options = {
    physics: {
      stabilization: false,
      repulsion: {
        centralGravity: .0001,
        springLength: 5000
      },
      barnesHut: {
      springConstant: 0,
      avoidOverlap: .7
    }
    },
    layout: {
      improvedLayout: false,
    },
    nodes: {
      shape: "circle",
      margin: 10,
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

createNetwork();


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
      network.body.data.edges.add([{from: nodeNumber, to: i}]);
      let tagList = "";
      matchingTags[tag].forEach((item, i) => {
        tagList += item + "<br>";
      });
      network.body.nodes[i].options.title = tagList;
    }
  }
}

function removeAllEdges(){
  network.body.data.edges.forEach((item, i) => {
    network.body.data.edges.remove([i]);
  });


}
