const controlScheme = [
    ["Hue", "hue", 1, 360, 150],
    ["Saturation", "sat", 1, 100, 100],
    ["# of Colors", "divisions", 1, 32, 2],
    ["Separation", "separation", 0, 32, 1],
    ["Brightness", "brightness", 1, 100, 100],
    ["BPM", "bpm", 30, 200, 90],
    ["Beat Divisions", "beat", 1, 8, 4],
    ["Slide", "slide", 0, 16, 0]
]
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
    var table = document.getElementById('controls')
    for (var i = 0; i < controlScheme.length; i++) {
        // Create an empty tr element and add it to the 1st position of the table:
        var row = table.insertRow(i);

        // Insert new cells (td elements) at the 1st and 2nd position of the "new" tr element:
        var cell2 = row.insertCell(0);
        var cell3 = row.insertCell(1);
        var cell1 = row.insertCell(2);
        var cell4 = row.insertCell(3);

        var inputText = document.createElement('input')
        inputText.type = 'text'
        inputText.id = controlScheme[i][1]
        inputText.value = parseInt(controlScheme[i][4])
        cell1.appendChild(inputText)

        cell2.innerHTML = controlScheme[i][0]

        if (i == 0 || i == 4) {
            var check = document.createElement("input")
            check.type = "checkbox"
            check.name = controlScheme[i][0] + "_check"
            check.id = controlScheme[i][0] + "_check"
            check.value = "true"
            check.onclick = function () {
                document.getElementById("colorform").submit()
            }
            cell2.appendChild(check)
        }
        
        var minusButton = document.createElement('input')
        minusButton.type = 'submit'
        minusButton.name = controlScheme[i][1] + "_minus"
        minusButton.id = controlScheme[i][1] + "_minus"
        minusButton.value = "-"
        minusButton.addEventListener('click', function () {
            minus(this.id)
            submitRequest()
        }, false)
        //, controlScheme[i][2], controlScheme[i][1]);
        cell3.appendChild(minusButton)

        var plusButton = document.createElement('input')
        plusButton.type = 'submit'
        plusButton.name = controlScheme[i][1] + "_plus"
        plusButton.id = controlScheme[i][1] + "_plus"
        plusButton.value = "+"
        plusButton.addEventListener('click', function () {
            plus(this.id)
            submitRequest()
        }, false)
        //, controlScheme[i][2], controlScheme[i][1]);
        cell4.appendChild(plusButton)
    }
    return
}

function submitRequest(action="") {
    var xhttp = new XMLHttpRequest();
    //- var table = document.getElementById('controls').rows
    var table = document.getElementById('controls').getElementsByTagName("input")
    var reqString = ""
    for (var i = 0; i < table.length; i++)
    {
        //- if (table[i].type != "text") {
        //- 	continue
        //- }
        if (table[i].type == "text") {
            if (i != 0)	{reqString = reqString + "&"}
            reqString = reqString + table[i].id + "=" + table[i].value
        }
        else if (table[i].type == "checkbox"){
            if (table[i].checked) {
                // add id ischecked to request
            if (i != 0)	{reqString = reqString + "&"}
            reqString = reqString + table[i].id + "=" + table[i].value
            }
        }
    }
    // send the checkboxes too
    if (action != "")
        {reqString = reqString + "&func=" + action}
    var colorlist = getColors()
    reqString = reqString + "&colorlist=" + colorlist.replace(/\s/g, "")
    console.log(reqString)
    xhttp.open("POST", window.location.href, true)
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send(reqString)
}

function getColors() {
    return document.getElementById("colorlist").value;
}

function minus(i) {
    var target = i.substring(0, i.length - 6)
    var newVal = document.getElementById(target).value - 1
    var min = getIByID(target)
    if (newVal < min[2]){
        newVal = min[2];
    }
    document.getElementById(target).value = newVal
    //- document.getElementById("colorform").submit()
}

function plus(i) {
    var target = i.substring(0, i.length - 5)
    var newVal = parseInt(document.getElementById(target).value) + 1
    var min = getIByID(target)
    if (newVal > min[3]) {
        newVal = min[3];
    }
    document.getElementById(target).value = newVal
    //- document.getElementById("colorform").submit()
}

function getIByID(id) {
    for (i = 0; i < controlScheme.length; i++)
    {
        if (controlScheme[i][1] == id)
        {
            return controlScheme[i]
        }
    }
    return null
}