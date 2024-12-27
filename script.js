document.addEventListener("DOMContentLoaded", () => {
    fetch("publications.tsv")
        .then((response) => response.text())
        .then((data) => {
            const publicationList = document.getElementById("publication-list");
            const publications = parseTSV(data);

            // Group by Year
            const grouped = publications.reduce((acc, pub) => {
                acc[pub.Year] = acc[pub.Year] || [];
                acc[pub.Year].push(pub);
                return acc;
            }, {});

            for (const year of Object.keys(grouped).sort((a, b) => b - a)) {
                const yearSection = document.createElement("div");
                yearSection.innerHTML = `<h3 class="text-secondary">${year}</h3>`;
                const ul = document.createElement("ul");
                ul.classList.add("list-unstyled");

                grouped[year].forEach((pub) => {
                    const li = document.createElement("li");
                    li.classList.add("d-flex", "align-items-center", "p-3", "bg-light", "rounded", "mb-3");
                    console.warn(pub.Authors);
                    const authors = new String(pub.Authors).replace("Simon Ostermann", "<strong>Simon Ostermann</strong>");
                    console.warn(authors);
                    li.innerHTML = `
                        <img src="${pub.Image}" alt="${pub.Topic}" class="rounded me-3" style="width: 60px; height: 60px;">
                        <div>
                            <p class="mb-1" style="color: #1a1a1a"><strong>${pub.Title}</strong> - <i>${pub.Source}</i> - <strong><a href="${pub.Link}">paper link</a></strong></p>
                            <p class="mb-0" style="color: #1a1a1a"><i>${authors}</i></p>
                            <p class="mb-0" style="color: #1a1a1a">${pub.Topic}</p>
                        </div>
                    `;
                    ul.appendChild(li);
                });

                yearSection.appendChild(ul);
                publicationList.appendChild(yearSection);
            }
        })
        .catch((error) => console.error("Error loading publications:", error));
});

function parseTSV(data) {
    const lines = data.trim().split("\n");
    const headers_orig = lines.shift().split("\t");
    const headers = headers_orig.map(item => item.replace(/^\s+|\s+$/g, ''));
    console.warn(headers);
    return lines.map((line) => {
        const values = line.split("\t");
        return headers.reduce((acc, header, index) => {
            acc[header] = values[index];
            return acc;
        }, {});
    });
}



