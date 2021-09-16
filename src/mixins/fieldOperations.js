const operations = {
    methods: {
        increment(field, ref = null) {
            console.log(this[field])
            if (!field || this[field] === undefined) return

            if (this[field] === '') {
                this[field] = "1"
                return
            }

            this[field] = String(parseFloat(this[field]) + 1)

            ref && this.$nextTick(() => { this.$refs[ref].focus() })
        },
        decrement(field, ref = null) {
            console.log(this[field])
            if (!field || this[field] === undefined) return

            if (this[field] === '' || this[field] === "1") {
                this[field] = "0"
                return
            }

            this[field] = String(parseFloat(this[field]) - 1)

            ref && this.$nextTick(() => { this.$refs[ref].focus() })
        }
    }
}
  
export default operations