document.addEventListener("DOMContentLoaded", function()
{
    let arr = JSON.parse(localStorage.getItem("habits")) || [];
    let checks = JSON.parse(localStorage.getItem("checkmarks")) || {};
    let today = new Date();
    let dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    let currentWeekStart = getWeekStart(today);
    let button = document.querySelector("#b1");
    let input = document.querySelector("#in");

  

    function getWeekStart(date)
    {
        let d = new Date(date);
        let day = d.getDay();
        let diff = (day === 0) ? 6 : day - 1;
        d.setDate(d.getDate() - diff);
        d.setHours(0, 0, 0, 0);
        return d;
    }

    function getDateKey(date)
    {
        let y = date.getFullYear();
        let m = String(date.getMonth() + 1).padStart(2, '0');
        let d = String(date.getDate()).padStart(2, '0');
        return y + "-" + m + "-" + d;
    }

    function getStreak(habit)
    {
        let streak = 0;
        let d = new Date(today);
        let todayKey = getDateKey(today);

        if(checks[habit] && checks[habit][todayKey])
        {
            streak++;
        }

        d.setDate(d.getDate() - 1);
        while(true)
        {
            let key = getDateKey(d);
            if(checks[habit] && checks[habit][key])
            {
                streak++;
                d.setDate(d.getDate() - 1);
            }
            else
            {
                break;
            }
        }
        return streak;
    }

    

    function showHabits()
    {
        let list = document.querySelector("#habit-list");
        if(!list) return;
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


    function renderGrid()
    {
        let grid = document.querySelector("#weekly-grid");
        if(!grid) return;
        grid.innerHTML = "";

        if(arr.length === 0) return;

        // week navigation
        let startKey = getDateKey(currentWeekStart);
        let endDate = new Date(currentWeekStart);
        endDate.setDate(endDate.getDate() + 6);
        let endKey = getDateKey(endDate);

        let nav = '<div class="week-nav">';
        nav += '<button id="prev-week">◀ Prev</button>';
        nav += '<span>' + startKey + '  to  ' + endKey + '</span>';
        nav += '<button id="next-week">Next ▶</button>';
        nav += '<button id="today-week">Today</button>';
        nav += '</div>';

        // table header
        let table = '<table class="habit-table"><thead><tr><th>Habit</th>';
        for(let i = 0; i < 7; i++)
        {
            let d = new Date(currentWeekStart);
            d.setDate(d.getDate() + i);
            let key = getDateKey(d);
            let todayKey = getDateKey(today);
            let isToday = (key === todayKey);
            table += '<th class="' + (isToday ? 'today-col' : '') + '">' + dayNames[i] + '<br>' + d.getDate() + '</th>';
        }
        table += '<th>🔥</th></tr></thead><tbody>';

        // table rows
        for(let h = 0; h < arr.length; h++)
        {
            table += '<tr><td class="habit-name">' + arr[h] + '</td>';
            for(let i = 0; i < 7; i++)
            {
                let d = new Date(currentWeekStart);
                d.setDate(d.getDate() + i);
                let key = getDateKey(d);
                let todayKey = getDateKey(today);
                let isToday = (key === todayKey);
                let isChecked = (checks[arr[h]] && checks[arr[h]][key]) ? true : false;
                table += '<td class="check-cell ' + (isToday ? 'today-col' : '') + '" data-habit="' + h + '" data-day="' + i + '">';
                table += isChecked ? '✔' : '';
                table += '</td>';
            }
            table += '<td class="streak-count">' + getStreak(arr[h]) + '</td>';
            table += '</tr>';
        }
        table += '</tbody></table>';

        grid.innerHTML = nav + table;

        // checkmark click
        document.querySelectorAll(".check-cell").forEach(function(cell)
        {
            cell.addEventListener("click", function()
            {
                let hIndex = parseInt(cell.getAttribute("data-habit"));
                let dIndex = parseInt(cell.getAttribute("data-day"));
                let d = new Date(currentWeekStart);
                d.setDate(d.getDate() + dIndex);
                let key = getDateKey(d);
                let habit = arr[hIndex];

                if(!checks[habit]) checks[habit] = {};
                if(checks[habit][key])
                    delete checks[habit][key];
                else
                    checks[habit][key] = true;

                localStorage.setItem("checkmarks", JSON.stringify(checks));
                renderGrid();
            });
        });

        // week navigation clicks
        document.querySelector("#prev-week").addEventListener("click", function()
        {
            currentWeekStart.setDate(currentWeekStart.getDate() - 7);
            renderGrid();
        });
        document.querySelector("#next-week").addEventListener("click", function()
        {
            currentWeekStart.setDate(currentWeekStart.getDate() + 7);
            renderGrid();
        });
        document.querySelector("#today-week").addEventListener("click", function()
        {
            currentWeekStart = getWeekStart(today);
            renderGrid();
        });
    }



    button.addEventListener("click", function()
    {
        let txt = input.value;
        if(txt === "") return;

        arr.push(txt);
        checks[txt] = {};
        localStorage.setItem("habits", JSON.stringify(arr));
        localStorage.setItem("checkmarks", JSON.stringify(checks));
        input.value = "";
        showHabits();
        renderGrid();
    });

    showHabits();
    renderGrid();
});

function deleteHabit(index)
{
    let arr = JSON.parse(localStorage.getItem("habits")) || [];
    let checks = JSON.parse(localStorage.getItem("checkmarks")) || {};
    let habit = arr[index];
    arr.splice(index, 1);
    delete checks[habit];
    localStorage.setItem("habits", JSON.stringify(arr));
    localStorage.setItem("checkmarks", JSON.stringify(checks));
    location.reload();
}