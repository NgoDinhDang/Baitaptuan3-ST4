let danhSach = [];
let hienThi = [];
let trangHienTai = 1;
let kichThuocTrang = 5;
let sapXepHienTai = { cot: null, tang: true };

const API = "https://api.escuelajs.co/api/v1/products";

async function taiDuLieu() {
    const res = await fetch(API);
    const data = await res.json();

    // Chỉ lấy category Clothes
   danhSach = data
    .filter(p => p.category?.name === "Clothes")
    .filter(p => p.id !== 70); //

    hienThi = [...danhSach];
    veBang();
}

function veBang() {
    const tbody = document.getElementById("noiDungBang");
    tbody.innerHTML = "";

    const batDau = (trangHienTai - 1) * kichThuocTrang;
    const ketThuc = batDau + kichThuocTrang;
    const duLieuTrang = hienThi.slice(batDau, ketThuc);

    duLieuTrang.forEach(sp => {
        const tr = document.createElement("tr");
        tr.title = sp.description; // Hover hiện mô tả

        tr.innerHTML = `
            <td>${sp.id}</td>
            <td>${sp.title}</td>
            <td>${sp.price}</td>
            <td>${sp.category?.name}</td>
            <td><img src="${sp.images[0]}" width="50"></td>
        `;

        tbody.appendChild(tr);
    });

    document.getElementById("thongTinTrang").innerText =
        `Trang ${trangHienTai} / ${Math.ceil(hienThi.length / kichThuocTrang)}`;
}

document.getElementById("timKiem").addEventListener("input", e => {
    const giaTri = e.target.value.toLowerCase();
    hienThi = danhSach.filter(sp =>
        sp.title.toLowerCase().includes(giaTri)
    );
    trangHienTai = 1;
    veBang();
});

document.getElementById("soLuongTrang").addEventListener("change", e => {
    kichThuocTrang = parseInt(e.target.value);
    trangHienTai = 1;
    veBang();
});

function sapXep(cot) {
    if (sapXepHienTai.cot === cot) {
        sapXepHienTai.tang = !sapXepHienTai.tang;
    } else {
        sapXepHienTai = { cot: cot, tang: true };
    }

    hienThi.sort((a, b) => {
        if (a[cot] < b[cot]) return sapXepHienTai.tang ? -1 : 1;
        if (a[cot] > b[cot]) return sapXepHienTai.tang ? 1 : -1;
        return 0;
    });

    veBang();
}

function trangSau() {
    if (trangHienTai * kichThuocTrang < hienThi.length) {
        trangHienTai++;
        veBang();
    }
}

function trangTruoc() {
    if (trangHienTai > 1) {
        trangHienTai--;
        veBang();
    }
}

function xuatCSV() {
    const batDau = (trangHienTai - 1) * kichThuocTrang;
    const ketThuc = batDau + kichThuocTrang;
    const duLieuTrang = hienThi.slice(batDau, ketThuc);

    let csv = "ID,Tên sản phẩm,Giá,Danh mục\n";
    duLieuTrang.forEach(sp => {
        csv += `${sp.id},"${sp.title}",${sp.price},"${sp.category?.name}"\n`;
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "sanpham.csv";
    link.click();
}

function moModalTao() {
    const ten = prompt("Nhập tên sản phẩm:");
    const gia = prompt("Nhập giá:");

    fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            title: ten,
            price: parseInt(gia),
            description: "Sản phẩm mới",
            categoryId: 1,
            images: ["https://placeimg.com/640/480/any"]
        })
    }).then(() => {
        alert("Tạo sản phẩm thành công!");
        taiDuLieu();
    });
}

taiDuLieu();
