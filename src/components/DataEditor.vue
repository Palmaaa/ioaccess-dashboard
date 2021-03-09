<template>
    <v-simple-table>
        <thead>
            <tr>
                <th class="text-left">
                    Nome
                </th>
                <th class="text-left">
                    RA
                </th>
                <th class="text-left">
                    Expediente
                </th>
                <th class="text-left">
                    Gestor
                </th>
            </tr>
        </thead>
        <tbody>
            <table-row-editor-add 
                v-on:addEmployee="addEmployee"
            />
            <table-row-editor 
                v-bind:employee="employee" 
                v-for="(employee) in employees" 
                v-bind:key="employee.id"
                v-on:removeEmployee="removeEmployee"
            />
        </tbody>
    </v-simple-table>
</template>

<script>
import { db } from '../firebase/index'
import TableRowEditor from './TableRowEditor.vue'
import TableRowEditorAdd from './TableRowEditorAdd.vue'

export default {
  components: {
    TableRowEditor,
    TableRowEditorAdd
  },
  data() {
    return {
        employees: [],
    }
  },
  methods: {
      removeEmployee(id) {
          this.employees = this.employees.filter(employee => employee.id != id)
      },
      addEmployee(formattedEmployee, name) {
          this.employees.push(formattedEmployee)
          console.log(this.employees)
          var QRCode = require('qrcode')
 
          QRCode.toDataURL(this.employees[this.employees.length - 1].id, function (err, url) {
            console.log(url)
            var a = document.createElement('a');
            a.href = url;
            a.download = 'qrcode_'+name+'.png';
            // Trigger the download
            a.click();
          })
      }
  },
  computed: {

  },
  async created() {
    const employeesSnapshot = await db.collection('Tabela_Funcionario').get()
    const employees = employeesSnapshot.docs.map((docSnapshot) => ({ data: docSnapshot.data(), id: docSnapshot.id }))
    
    this.employees = employees
  },
};
</script>