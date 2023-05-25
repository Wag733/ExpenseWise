const transactionHistory = JSON.parse(localStorage.getItem('transactionHistory')) || [];

function addTransaction(e) {
  e.preventDefault();

  let type = document.getElementById('type').value;
  let name = document.getElementById('name').value;
  let amount = document.getElementById('amount').value;
  let timestamp = new Date().getTime();

  if (type !== 'chooseOne' && name.length > 0 && amount > 0) {
    const transaction = {
      type,
      name,
      amount,
      timestamp,
      id: transactionHistory.length > 0 ? transactionHistory[transactionHistory.length - 1].id + 1 : 1,
    };

    transactionHistory.push(transaction);
    localStorage.setItem('transactionHistory', JSON.stringify(transactionHistory));
    showTransactions(); // Added: Show transactions after adding a new one
  }

  document.getElementById('expForm').reset();
  updateBalance();
}

function showTransactions(sortField = 'timestamp', sortOrder = 'desc', searchName = '') {
  const transactionTable = document.getElementById('transactionTable');
  const balanceDisplay = document.querySelector('.balance');

  transactionTable.innerHTML = '';
  balanceDisplay.textContent = calculateBalance();

  let filteredTransactions = [...transactionHistory];

  filteredTransactions.sort((a, b) => {
    let aValue, bValue;

    if (sortField === 'timestamp') {
      aValue = a.timestamp;
      bValue = b.timestamp;
    } else if (sortField === 'name') {
      aValue = a.name;
      bValue = b.name;
    } else if (sortField === 'amount') {
      aValue = a.amount;
      bValue = b.amount;
    }

    if (sortOrder === 'asc') {
      return aValue - bValue;
    } else {
      return bValue - aValue;
    }
  });

  if (searchName.trim() !== '') {
    filteredTransactions = filteredTransactions.filter(transaction =>
      transaction.name.toLowerCase().includes(searchName.toLowerCase())
    );
  }

  for (let i = 0; i < filteredTransactions.length; i++) {
    const transactionType = filteredTransactions[i].type === 'income' ? 'Credit' : 'Debit';
    const transactionDate = new Date(filteredTransactions[i].timestamp);
    const formattedDate = transactionDate.toLocaleDateString();
    const formattedTime = transactionDate.toLocaleTimeString();

    transactionTable.innerHTML += `
      <tr>
        <td>${transactionType}</td>
        <td>${filteredTransactions[i].name}</td>
        <td>$${filteredTransactions[i].amount}</td>
        <td>${formattedDate}</td>
        <td>${formattedTime}</td>
        <td><button class="deleteButton" onclick="deleteTransaction(${filteredTransactions[i].id})">Delete</button></td>
      </tr>
    `;
  }
}

function deleteTransaction(id) {
  for (let i = 0; i < transactionHistory.length; i++) {
    if (transactionHistory[i].id == id) {
      transactionHistory.splice(i, 1);
      break; // Added: Exit the loop after finding and removing the transaction
    }
  }
  localStorage.setItem('transactionHistory', JSON.stringify(transactionHistory));
  updateBalance();
  showTransactions();
  }
  
  function updateBalance() {
  const balanceDisplay = document.querySelector('.balance');
  balanceDisplay.textContent = calculateBalance();
  }
  
  function calculateBalance() {
  let balance = 0;
  
  transactionHistory.forEach((transaction) => {
  if (transaction.type === 'income') {
  balance += Number(transaction.amount);
  } else if (transaction.type === 'expense') {
  balance -= transaction.amount;
  }
  });
  
  return balance;
  }
  
  document.getElementById('expForm').addEventListener('submit', addTransaction);
  
  document.getElementById('sortButton').addEventListener('click', () => {
  const sortField = document.getElementById('sortField').value;
  const sortOrder = document.getElementById('sortOrder').value;
  const searchName = document.getElementById('searchName').value;
  
  showTransactions(sortField, sortOrder, searchName);
  });
  
  showTransactions();
 
