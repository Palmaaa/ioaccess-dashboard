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
            <table-row-editor 
                v-bind:employee="employee" 
                v-for="(employee, index) in employees" 
                :key="index"
                v-on:removeEmployee="removeEmployee"
            />
        </tbody>
    </v-simple-table>
</template>

<script>
import { db } from '../firebase/index'
import TableRowEditor from './TableRowEditor.vue'

export default {
  components: {
    TableRowEditor
  },
  data() {
    return {
        employees: [],
    }
  },
  methods: {
      removeEmployee(id) {
          this.employees = this.employees.filter(employee => employee.id != id)
      }
  },
  async created() {
    const employeesSnapshot = await db.collection('Tabela_Funcionario').get()
    const employees = employeesSnapshot.docs.map((docSnapshot) => ({ data: docSnapshot.data(), id: docSnapshot.id }))
    
    this.employees = employees
  },
};
</script>