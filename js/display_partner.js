
export async function display_partner(company) {

    const business_partners = company["主要取引先"];
    const text_resultDiv = document.getElementById("text_result");

    if (business_partners.length == 0) {
        const p = document.createElement("p");
        p.textContent = "主要取引先は登録されていません。";
        text_resultDiv.appendChild(p);
    } else {
        const h3 = document.createElement("h3");
        h3.textContent = "主要取引先";
        text_resultDiv.appendChild(h3);

        // 主要取引先をテキストで表示
        const ul = document.createElement("ul");
        business_partners.forEach(element => {
            let li = document.createElement("li");
            li.innerHTML = `<a href="https://ueno2025.github.io/reverse_clients/?code=${element["取引先名"]}" target="_blank" rel="noopener noreferrer">
                            ${element["取引先名"]} - 金額:${element["金額"]}&nbsp;&nbsp;&nbsp;割合:${element["割合"]}%`;
            ul.appendChild(li);
        });
        text_resultDiv.appendChild(ul);
    }

    create_chart(business_partners);

}

// チャートを描画する関数
async function create_chart(business_partners) {

    // 主要取引先を円グラフで表示
    let validClients = business_partners.filter(c => {
        return c["割合"] !== "-" && c["割合"] !== "ー" && !isNaN(parseFloat(c["割合"]));
    });

    let labels = validClients.map(c => c["取引先名"]);
    let data = validClients.map(c => parseFloat(c["割合"]));

    if (data.length === 0) {
        labels = ["その他"];
        data = [100];
    } else {
        const total = data.reduce((a, b) => a + b, 0);
        if (total < 100) {
            labels.push("その他");
            data.push(100 - total)
        }
    }

    let baseColors = [
        "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF",
        "#FF9F40", "#8AC926", "#1982C4", "#6A4C93", "#FF595E"
    ];

    // 取引先ごとに色を割り当てる
    const backgroundColors = labels.map((l, i) => {
        if (l === "その他") return "#C9CBCF";
        return baseColors[i % baseColors.length];
    });

    const ctx = document.getElementById("myChart").getContext("2d");

    const chart = new Chart(ctx, {
        type: "pie",
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: backgroundColors,
            }]
        },
        
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                datalabels: {
                    formatter: (value) => value.toFixed(1) + '%',
                    color: "#000",
                    font: { weight: "bold", size: 12 }
                },
                legend: { position: "right" }
            }
        },
        plugins: [ChartDataLabels]
    });

}
