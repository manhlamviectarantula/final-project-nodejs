$(document).ready(function() {
    const PAGE_SIZE = 9;

    function loadPage(page, search) {
        $('#content').html('');
        $.ajax({
            url: `http://localhost:3000/api/v1/product/list-product?page=${page}&search=${search || ''}`,
            method: 'GET'
        }).then(rs => {
            $('#content').empty();
            rs.data.forEach(element => {
                let formattedPrice = Number(element.price).toLocaleString('vi-VN') + ' đ';
                var item = $(`
                    <div class="box">
                        <div class="image">
                            <div class="icons">
                                <a href="/detail_product/${element._id}" class="fas fa-eye"></a>
                            </div>
                            <img src="/uploads/${element.thumbnail}" alt="">
                        </div>
                        <div class="content">
                            <h3>${element.name}</h3>
                            <div class="stars">
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star-half-alt"></i>
                            </div>
                            <div class="price">${formattedPrice}</div>
                        </div>
                    </div>
                `);
                $('#content').append(item);
            });

            $('#paging').pagination({
                dataSource: new Array(rs.total),
                pageSize: PAGE_SIZE,
                // showGoInput: true,
                // showGoButton: false,
                pageNumber: page,
                afterPageOnClick: function(event, pageNumber) {
                    loadPage(pageNumber, search);
                },
                afterPreviousOnClick: function(event, pageNumber) {
                    loadPage(pageNumber, search);
                },
                afterNextOnClick: function(event, pageNumber) {
                    loadPage(pageNumber, search);
                }
            });
        });
    }

    $('#searchForm').on('submit', function(event) {
        event.preventDefault();
        const search = $('#search').val();
        loadPage(1, search);
    });

    loadPage(1);
});

//phân trang chưa làm search
// $('#paging').pagination({
//     dataSource: 'http://localhost:3000/api/v1/product/list-product?page=1' ,
//     //http://localhost:3000/api/v1/product/list-product/search?keyword=nhang%20muỗi&page=1
//     locator: 'data',
//     totalNumberLocator: function(response) {
//         return response.total
//     },
//     pageSize: 9,
//     afterPageOnClick: function (event, pageNumber) {
//         loadPage(pageNumber)
//     },
//     afterPreviousOnClick: function(event, pageNumber){
//         loadPage(pageNumber)
//     },
//     afterNextOnClick: function(event, pageNumber){
//         loadPage(pageNumber)
//     }
// })

// function loadPage(page) {
//     $('#content').html('')
//     $.ajax({
//         url: 'http://localhost:3000/api/v1/product/list-product?page=' + page
//     })
//         .then(rs => {
//             console.log(rs.tongSoPage)

//             for (let i = 0; i < rs.data.length; i++) {
//                 const element = rs.data[i];
//                 let formattedPrice = Number(element.price).toLocaleString('vi-VN') + ' đ';
//                 var item = $(`<div class="box">
//                 <div class="image">
//                     <div class="icons">
//                         <a href="/detail_product/${element._id}" class="fas fa-eye"></a>
//                     </div>
//                     <img src="${element.thumbnail}" alt="">
//                 </div>
//                 <div class="content">
//                     <h3>${element.name}</h3>
//                     <div class="stars">
//                         <i class="fas fa-star"></i>
//                         <i class="fas fa-star"></i>
//                         <i class="fas fa-star"></i>
//                         <i class="fas fa-star"></i>
//                         <i class="fas fa-star-half-alt"></i>
//                     </div>
//                     <div class="price">${formattedPrice}</div>
//                 </div>
//                 </div>`)
//                 $('#content').append(item)
//             }
//         })
// }

// loadPage(1)