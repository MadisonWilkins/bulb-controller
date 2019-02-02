// TODO this should be a get request
var fields = [
    "Colors",
    "Beat Divisions",
    "Flashing",
    "Color Separation",
    "Slide Time",
    "Saturation",
    "Brightness"            
]

// TODO this should also be a get request
var pattern = [
    [
        2, 4, 0, 0, 0, 100, 100
    ]
]

export function crtAl() {
    alert("it worked")
}

export function createInputs() {
    var table = document.getElementById('table')
    var row1 = table.insertRow(0)
    var row2 = table.insertRow(1)
    var cell = row2.insertCell(0)
    var input = document.createElement("input")
    input.type = "button"
    input.text = "add"
    input.onclick = function() {
        // do the scriptyboi
        var newRow = []
        for (var i = 0; i < fields.length; i++) {
            newRow.push(parseInt(document.getElementById(fields[i].toLowerCase() + "_input")))
        }
        pattern[pattern.length] = newRow
    }
    cell.appendChild(input)
    for (var i = 0; i < fields.length; i++) {
        cell = row1.insertCell(i + 1)
        cell.innerHTML = fields[i]
        var cell2 = row2.insertCell(i + 1)
        var name = fields[i].toLowerCase()
        input = document.createElement("input")
        input.type = "text"
        input.name = input.id = name + "_input"
        cell2.appendChild(input)
    }
    refreshPatterns()
}

export function refreshPatterns() {

}