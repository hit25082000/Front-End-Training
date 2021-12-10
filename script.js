const Modal = {
    trocar(){        
        document
            .querySelector('.modal-overlay')
            .classList
            .toggle('active')

    }
}

const Storage = {
    get(){
        return JSON.parse(loadStorage.getitem("XD") || []
    },
    set(transactions){
        localStorage.setItem("XD", JSON.stringify(transactions))
    },
}

const Transaction = {
    all: Storage.get(),
    add(Transaction){
        Transaction.all.push(transaction)
        app.reload()
    },
    remove(index) {
        transaction.all.splice(index, 1)    

        app.reload()
    },
    incomes() {
        let income = 0;
        Transaction.all.forEach((transaction) => {
            if(transaction.amount > 0) {
                income += transaction.amount;
            }
        })
        return income
    },
    expenses() {
        let expanse = 0;
        Transaction.all.forEach((transaction) => {
            if(transaction.amount < 0) {
                expanse += transaction.amount;
            }
        })
        return expanse
    },
    totals() {
        let total = 0;
        Transaction.all.forEach((transaction) => {            
            total += transaction.amount;            
        })
        return total
    },
}

const IndexToScript = {
    transactionsContent: document.querySelector('tbody'),

    addTable(transaction, index ){  
        console.log(transaction)      
        const tr = document.createElement('tr');
        tr.innerHTML = IndexToScript.innerTable(transaction, index)  
        tr.dataset.index = index      

        IndexToScript.transactionsContent.appendChild(tr)
    },

    innerTable(transaction, index) {
        const CSSclass = transaction.amount > 0 ? "income" : "expense"

        const amount = Utilities.formatCurency(transaction.amount)

        const table =`                        
        <td class="description">${transaction.description}</td>
        <td class="${CSSclass}">${amount}</td>
        <td class="date">${transaction.date}</td>
        <td class="description"> <img onclick="Transaction.remove${index}" src="./assets/minus.svg" alt="Remover Transação"> </td>         
        `
        return table
    },

    updateBalance() {
        document.getElementById('incomeDisplay').innerHTML = Utilities.formatCurency(Transaction.incomes())
        document.getElementById('expenseDisplay').innerHTML = Utilities.formatCurency(Transaction.expenses())
        document.getElementById('totalDisplay').innerHTML = Utilities.formatCurency(Transaction.totals())
    },

    clearTransactions() {
        IndexToScript.transactionsContent.innerHTML = ""
    }
}

const Utilities = {
    formatAmount(value){
        value = value*100
        return Math.round(value)
    },

    formatDate(date){
        const splittedDate = date.split("-")
        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
    },

    formatCurency(value){
        const signal = Number(value) < 0 ? "-" : ""

        value = String(value).replace(/\D/g,"")
//"g" global, /"\D"/ Tudo que não for numero EX "-" para ""

        value = Number(value) / 100 
        
        value = value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })
    return signal + value
    },
}

const Form = {
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

    getValues(){
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
        }
    },

    formatValues(){
        let {description,amount,date} = Form.getValues()

        amount = Utilities.formatAmount(amount)

        date = Utilities.formatDate(date)

        return {
            description,
            amount,
            date
        }
    },

    saveTransaction(transaction){
        Transaction.add(transaction)
    },

    validateFields(){
        const {description,amount,date} = Form.getValues()

        if(description.trim() === "" || amount.trim() === "" || date.trim() === ""){
            throw new Error("Please preencha todos os campos")
        }
    },

    clearFields(){
        Form.description.value = ""
        Form.amount.value = ""
        Form.date.value = ""
    },

    Submit(event) {
        event.preventDefault()

        try {
            Form.validateFields()
            const transaction = Form.formatValues()
            Form.saveTransaction(transaction)//Reload ja existem em add.transaction então não é necessario aqui
            Form.clearFields()
            Modal.trocar()             
            
        } catch (error) {
            alert(error.message)
        }
    }
}

const app = {
    init(){
        // Transaction.all.forEach((transaction, index) => {
            //     IndexToScript.addTable(transaction, index)
            // })        
            // IndexToScript.updateBalance()
        Transaction.all.forEach(IndexToScript.addTable)
        IndexToScript.updateBalance
        Storage.set(Transaction.all)
    },
    reload(){
        indexToScript.clearTransactions()
        app.init()
    },
}   
app.init()

