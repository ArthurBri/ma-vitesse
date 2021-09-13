const operations = {
    methods: {
        increment(field) {
            if (!field || this[field] === undefined) return
            console.log(this[field])

            if (typeof this[field] === 'string') {
                this[field] = String(parseFloat(this[field].replace(",", ".") ||0) + 1);
            } else {
                this[field] = String(this[field]++)
            }        
        },
        decrement(field) {
            if (!field || this[field] === undefined) return
            console.log(this[field])

            if (typeof this[field] === 'string') {
                this[field] = String(parseFloat(this[field].replace(",", ".") ||1) - 1);
            } else {
                this[field] = String(this[field]--)
            }    
        }
    }
  }
  
  export default operations