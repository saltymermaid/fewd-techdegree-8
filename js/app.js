let xhr = new XMLHTTPRequest();
xhr.onreadystatechange = function () {
  if (xhr.readyState === 4) {
    if (xhr.status === 200) {
      document.getElementById('ajax').innerHTML = xhr.responseText;
    } else {
      alert(xhr.statusText);
    }
  }
}


$.ajax({
  url: 'https://randomuser.me/api/',
  dataType: 'json',
  success: function(data) {
    console.log(data);
  }
});
