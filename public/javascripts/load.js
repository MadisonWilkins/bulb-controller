function sliderValues() {
    var table = document.getElementById('controls')
    var sliders = document.getElementsByClassName('slider')
    var outputs = table.getElementsByClassName('textarea')
    for (var i = 0; i < sliders.length; i++) {
        var row = table.rows[i + 1]
        // alert(row)
        row.cells[1].innerHTML = sliders[i].attributes.getNamedItem("value").value
        // alert(sliders[i].attributes.getNamedItem("value").value)
    }
    return
}

function loadControls() {
    var controlScheme = [
        ["Hue", "hue", 1, 360, 150],
        ["Saturation", "sat", 1, 100, 100],
        ["# of Colors", "divisions", 1, 32, 2],
        ["Color Separation", "separation", 0, 32, 1],
        ["Brightness", "brightness", 1, 100, 100],
        ["BPM", "bpm", 30, 200, 90],
        ["Beat Divisions", "beat", 1, 8, 4],
        ["Slide", "slide", 0, 16, 0]
    ]
    var table = document.getElementById('controls')
    for (var i = 0; i < controlScheme.length; i++) {
        // Create an empty tr element and add it to the 1st position of the table:
        var row = table.insertRow(i);

        // Insert new cells (td elements) at the 1st and 2nd position of the "new" tr element:
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);

        // Add some text to the new cells:
        cell1.innerHTML = controlScheme[i][0];
        if (i == 0 || i == 4) {
            var check = document.createElement("input")
            check.type = "checkbox"
            check.name = controlScheme[i][0] + "_check"
            check.id = controlScheme[i][0] + "_check"
            check.value = "true"
            check.onclick = function () {
                document.getElementById("colorform").submit()
            }
            cell1.appendChild(check)
        }
        // cell2.innerHTML = parseInt(controlScheme[i][4]);
        var inputText = document.createElement('input')
        inputText.type = 'text'
        inputText.id = controlScheme[i][1] + "-text"
        inputText.value = parseInt(controlScheme[i][4])
        inputText.onchange = function () {
            document.getElementById(this.id.substring(0, this.id.length - 5)).value = this.value
        }
        cell2.appendChild(inputText)

        var newSlider = document.createElement('input')
        // input onchange="sliderValues()" name="hue" id="hue" type="range" min="1" max="360" class="slider" value=150
        // ["Beat Divisions", "beat", 1, 8, 1]
        newSlider.name = controlScheme[i][1]
        newSlider.id = controlScheme[i][1]
        newSlider.type = "range"
        newSlider.min = controlScheme[i][2]
        newSlider.max = controlScheme[i][3]
        newSlider.className = "slider"
        newSlider.value = parseInt(controlScheme[i][4])
        newSlider.onclick = function () {
            document.getElementById(this.name + "-text").value = this.value
            document.getElementById("colorform").submit()
        }

        cell3.appendChild(newSlider)
    }
    return
}