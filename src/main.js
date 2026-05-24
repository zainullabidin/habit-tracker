

document.addEventListener("DOMContentLoaded", function()
{
    let arr = JSON.parse(localStorage.getItem("habits")) || [];
    let button = document.querySelector("#b1");
    let input = document.querySelector("#in");

    function showHabits()
    {
        let list = document.querySelector("#habit-list");
        list.innerHTML = "";

        if(arr.length === 0)
        {
            list.innerHTML = "<p>No habits yet! Tell Habinator what you want to track.</p>";
            return;
        }

        for(let i = 0; i < arr.length; i++)
        {
            list.innerHTML += '<div class="habit-item">'+'<span>'+arr[i]+'</span>'+'<button onclick="deleteHabit('+i+')">✕</button>'+'</div>';
        }
    }

    button.addEventListener("click", function()
    {
        let txt = input.value;
        if(txt === "") return;

        arr.push(txt);
        localStorage.setItem("habits", JSON.stringify(arr));
        input.value = "";
        showHabits();
    });

    showHabits();
});

function deleteHabit(index)
{
    let arr = JSON.parse(localStorage.getItem("habits")) || [];
    arr.splice(index, 1);
    localStorage.setItem("habits", JSON.stringify(arr));
    location.reload();
}