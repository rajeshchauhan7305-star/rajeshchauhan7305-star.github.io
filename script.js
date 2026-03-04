const map = {
    "O":10,"A+":9,"A":8,
    "B+":7,"B":6,"C":5,
    "D":4,"F":0
};

const CGPA_FACTOR = 9.5;

window.onload = () => addRow();

function addRow(){
    document.getElementById("rows").insertAdjacentHTML("beforeend",`
    <div class="row">
        <input class="g" placeholder="O / A+ / 10">
        <input class="c" type="number" placeholder="Credits">
        <button class="remove" onclick="this.parentElement.remove()">X</button>
    </div>`);
}

function calcMarks(){
    let m = parseFloat(marks.value);
    let t = parseFloat(total.value);

    if(!m || !t || t<=0){
        marksResult.innerText="Invalid Input";
        return;
    }

    let p = (m/t*100).toFixed(2);
    let cg = (p/CGPA_FACTOR).toFixed(2);

    marksResult.innerText = `CGPA: ${cg} | ${p}%`;
}

function calcCGPA(){
    let g = document.querySelectorAll(".g");
    let c = document.querySelectorAll(".c");

    let tp=0, tc=0;

    for(let i=0;i<g.length;i++){
        let grade = g[i].value.trim().toUpperCase();
        let gp = isNaN(grade)? map[grade] : Number(grade);
        let cr = Number(c[i].value);

        if(gp==null || !cr){
            gradeResult.innerText="Invalid Input";
            return;
        }

        tp += gp*cr;
        tc += cr;
    }

    let cg = (tp/tc).toFixed(2);
    let p = (cg*CGPA_FACTOR).toFixed(2);

    gradeResult.innerText=`CGPA: ${cg} | ${p}%`;
}

function downloadMarksPDF(){
    let form = new FormData();
    form.append("type","marks_pdf");
    form.append("marks",marks.value);
    form.append("total",total.value);

    fetch("generate_pdf.php",{method:"POST",body:form})
    .then(res=>res.blob())
    .then(blob=>{
        let a=document.createElement("a");
        a.href=URL.createObjectURL(blob);
        a.download="Marks_CGPA.pdf";
        a.click();
    });
}

function downloadGradesPDF(){
    let g=document.querySelectorAll(".g");
    let c=document.querySelectorAll(".c");

    let form=new FormData();
    form.append("type","grades_pdf");

    g.forEach(x=>form.append("grades[]",x.value));
    c.forEach(x=>form.append("credits[]",x.value));

    fetch("generate_pdf.php",{method:"POST",body:form})
    .then(res=>res.blob())
    .then(blob=>{
        let a=document.createElement("a");
        a.href=URL.createObjectURL(blob);
        a.download="Grades_CGPA.pdf";
        a.click();
    });
}

function saveMarks() {

    let result = document.getElementById("marksResult").innerText;

    if (result.includes("--")) return;

    let box = document.getElementById("history");

    box.innerHTML += `<p>📘 ${result}</p>`;

}

function saveGrades() {

    let result = document.getElementById("gradeResult").innerText;

    if (result.includes("--")) return;

    let box = document.getElementById("history");

    box.innerHTML += `<p>📗 ${result}</p>`;

}

function clearHistory() {

    document.getElementById("history").innerHTML = "";

}

function checkResult() {

    let val = parseFloat(document.getElementById("checkValue").value);

    if (!val || val <= 0) {

        document.getElementById("passFailResult").innerText =

            "Enter valid value";

        return;

    }

    let result;

    /* Agar CGPA dala (<=10 assume) */

    if (val <= 10) {

        let percent = val * CGPA_FACTOR;

        result = percent >= 40 ? "PASS ✅" : "FAIL ❌";

        document.getElementById("passFailResult").innerText =

            `Result: ${result} ( ${percent.toFixed(2)}% )`;

    }

    else {

        /* Agar Percentage dala */

        result = val >= 40 ? "PASS ✅" : "FAIL ❌";

        document.getElementById("passFailResult").innerText =

            `Result: ${result}`;

    }

}