const bankList = document.querySelector('#bank-list');
const form = document.querySelector('#add-bank-form');

// create element & render cafe
function renderCafe(doc){
    let li = document.createElement('li');
    let name = document.createElement('span');
    let phone = document.createElement('span');
    let account = document.createElement('span');
    let amount = document.createElement('span');
    let transaction = document.createElement('span');
    let date = document.createElement('span');
	let download = document.createElement('div');
	
    li.setAttribute('data-id', doc.id);
    name.textContent = doc.data().name;
    phone.textContent = doc.data().phone;
    account.textContent = doc.data().account;
    amount.textContent = doc.data().amount;
    transaction.textContent = doc.data().transaction;
    date.textContent = doc.data().date;

    li.appendChild(name);
    li.appendChild(phone);
    li.appendChild(account);
    li.appendChild(amount);
    li.appendChild(transaction);
    li.appendChild(date);

    bankList.appendChild(li);
}

function myDownload(){
	
	// getting data
//db.collection('bank').orderBy('name').get().then(snapshot => {
//    snapshot.docs.forEach(doc => {
//        renderBank(doc);
//    });
//});
	
	var usersCollectionRef = db.collection("bank"); //Creates a reference to the Users collection

var query = usersCollectionRef.where("bank", "==", "name"); //Creates a query based on the collection

query.get().then(function(snapshot) { //Call get() to get a QuerySnapshot

            if (snapshot.empty) { //Check whether there are any documents in the result
                console.log('no documents found');
            } else {
                    snapshot.docs.map(function (documentSnapshot) {
                        //Not necessary to do that  -> return documentSnapshot.data();
                        console.log(documentSnapshot.data().name); 
                    });
            }

});
	}
	

var pdfdoc = new jsPDF();
var specialElementHandlers = {

‘#demo’: function (element, renderer) {

return true;

}

};

 

$(document).ready(function(){

$(“#cmx”).click(function(){

pdfdoc.fromHTML($(‘#PDFcontent’).html(), 10, 10, {

‘width’: 110,

‘elementHandlers’: specialElementHandlers

});

pdfdoc.save(‘Cloud Bank.pdf’);

});});

 



// saving data
form.addEventListener('submit', (e) => {
    e.preventDefault();
    db.collection('banks').add({
        name: form.name.value,
        phone: form.phone.value,
        account: form.account.value,
        amount: form.amount.value,
        transaction: form.transaction.value,
        date: form.date.value
    });
    form.name.value = '';
    form.phone.value = '';
    form.account.value = '';
    form.amount.value = '';
    form.transaction.value = '';
    form.date.value = '';
});

// real-time listener
db.collection('bank').orderBy('name').onSnapshot(snapshot => {
    let changes = snapshot.docChanges();
    changes.forEach(change => {
        console.log(change.doc.data());
        if(change.type == 'added'){
            renderCafe(change.doc);
        } else if (change.type == 'removed'){
            let li = bankList.querySelector('[data-id=' + change.doc.id + ']');
            bankList.removeChild(li);
        }
    });
});