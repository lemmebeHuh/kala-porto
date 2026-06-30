const fs = require('fs');
const { execSync } = require('child_process');

// Install xlsx if not exists
try {
    require.resolve('xlsx');
} catch (e) {
    console.log('Menginstall modul excel (xlsx)...');
    execSync('npm install xlsx', { stdio: 'inherit' });
}

const XLSX = require('xlsx');
const links = fs.readFileSync('daftar_link.txt', 'utf8').trim().split('\n').filter(l => l.trim() !== '');

console.log('Mulai mengambil ulang data dan membuat file Excel...');
const results = [];

for (let i = 0; i < links.length; i++) {
    const url = links[i].trim();
    console.log(`[${i+1}/${links.length}] Mengambil data untuk: ${url}`);
    try {
        // Run yt-dlp to dump JSON
        const output = execSync(`yt-dlp --dump-json "${url}"`, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] });
        const data = JSON.parse(output);
        
        results.push({
            URL: url,
            Likes: data.like_count || 0,
            Comments: data.comment_count || 0,
            Caption: data.description || ''
        });
    } catch (e) {
        console.log(`Gagal mengambil data untuk: ${url}`);
        results.push({
            URL: url,
            Likes: 'Error',
            Comments: 'Error',
            Caption: 'Error'
        });
    }
}

// Create Excel workbook and sheet
const ws = XLSX.utils.json_to_sheet(results);
const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, "Insights");

// Write to file
XLSX.writeFile(wb, "Instagram_Insights.xlsx");
console.log('Selesai! Data disimpan secara rapi di Instagram_Insights.xlsx');
