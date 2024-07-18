// main.js

function createSquares() {
    var number = document.getElementById("numberInput").value;
    var squaresContainer = document.getElementById("squaresContainer");
    squaresContainer.innerHTML = "";

    for (var i = 0; i < number; i++) {
        var square = document.createElement("div");
        square.classList.add("square");
        squaresContainer.appendChild(square);
    }
}
