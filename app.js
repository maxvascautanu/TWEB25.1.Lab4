// ===== Data copied from Wikipedia (Real Madrid CF → “Current squad”, as of 2 February 2026) =====
const squad = [
    { no: 1, pos: "GK", nation: "BEL", player: "Thibaut Courtois", notes: "" },
    { no: 2, pos: "DF", nation: "ESP", player: "Dani Carvajal", notes: "Captain" },
    { no: 3, pos: "DF", nation: "BRA", player: "Éder Militão", notes: "" },
    { no: 4, pos: "DF", nation: "AUT", player: "David Alaba", notes: "" },
    { no: 5, pos: "MF", nation: "ENG", player: "Jude Bellingham", notes: "" },
    { no: 6, pos: "MF", nation: "FRA", player: "Eduardo Camavinga", notes: "" },
    { no: 7, pos: "FW", nation: "BRA", player: "Vinícius Júnior", notes: "" },
    { no: 8, pos: "MF", nation: "URU", player: "Federico Valverde", notes: "Vice-captain" },
    { no: 10, pos: "FW", nation: "FRA", player: "Kylian Mbappé", notes: "" },
    { no: 11, pos: "FW", nation: "BRA", player: "Rodrygo", notes: "" },
    { no: 12, pos: "DF", nation: "ENG", player: "Trent Alexander-Arnold", notes: "" },
    { no: 13, pos: "GK", nation: "UKR", player: "Andriy Lunin", notes: "" },
    { no: 14, pos: "MF", nation: "FRA", player: "Aurélien Tchouaméni", notes: "" },
    { no: 15, pos: "MF", nation: "TUR", player: "Arda Güler", notes: "" },
    { no: 16, pos: "FW", nation: "ESP", player: "Gonzalo García", notes: "" },
    { no: 17, pos: "DF", nation: "ESP", player: "Raúl Asencio", notes: "" },
    { no: 18, pos: "DF", nation: "ESP", player: "Álvaro Carreras", notes: "" },
    { no: 19, pos: "MF", nation: "ESP", player: "Dani Ceballos", notes: "" },
    { no: 20, pos: "DF", nation: "ESP", player: "Fran García", notes: "" },
    { no: 21, pos: "FW", nation: "MAR", player: "Brahim Díaz", notes: "" },
    { no: 22, pos: "DF", nation: "GER", player: "Antonio Rüdiger", notes: "" },
    { no: 23, pos: "DF", nation: "FRA", player: "Ferland Mendy", notes: "" },
    { no: 24, pos: "DF", nation: "ESP", player: "Dean Huijsen", notes: "" },
    { no: 30, pos: "FW", nation: "ARG", player: "Franco Mastantuono", notes: "" }
];

function $(id) {
    return document.getElementById(id);
}

function sortFn(mode) {
    if (mode === "NO_ASC") return (a, b) => a.no - b.no;
    if (mode === "NO_DESC") return (a, b) => b.no - a.no;
    if (mode === "NAME_ASC") return (a, b) => a.player.localeCompare(b.player);
    if (mode === "NAME_DESC") return (a, b) => b.player.localeCompare(a.player);
    return (a, b) => a.no - b.no;
}

function renderSquadTable() {
    const qEl = $("q");
    const posEl = $("pos");
    const sortEl = $("sort");
    const tbody = $("tbody");
    const empty = $("empty");

    if (!qEl || !posEl || !sortEl || !tbody || !empty) return;

    const q = qEl.value.trim().toLowerCase();
    const pos = posEl.value;
    const sort = sortEl.value;

    let rows = squad.filter(p => {
        const okPos = (pos === "ALL") ? true : (p.pos === pos);
        const okQ = (q === "") ? true : (
            p.player.toLowerCase().includes(q) ||
            p.nation.toLowerCase().includes(q) ||
            String(p.no).includes(q)
        );
        return okPos && okQ;
    });

    rows = rows.slice().sort(sortFn(sort));

    tbody.innerHTML = "";
    empty.style.display = rows.length ? "none" : "block";

    rows.forEach(p => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td><b>${p.no}</b></td>
            <td>${p.pos}</td>
            <td>${p.nation}</td>
            <td>${p.player}</td>
            <td>${p.notes || "-"}</td>
        `;
        tbody.appendChild(tr);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const yearEl = document.getElementById("year");
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    if ($("q") && $("pos") && $("sort") && $("reset")) {
        renderSquadTable();

        $("q").addEventListener("input", renderSquadTable);
        $("pos").addEventListener("change", renderSquadTable);
        $("sort").addEventListener("change", renderSquadTable);
        $("reset").addEventListener("click", () => {
            $("q").value = "";
            $("pos").value = "ALL";
            $("sort").value = "NO_ASC";
            renderSquadTable();
        });
    }
});

