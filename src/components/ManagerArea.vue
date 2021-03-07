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
                    Entrada
                </th>
                <th class="text-left">
                    Saída
                </th>
                <th class="text-left">
                    Justificar
                </th>
            </tr>
        </thead>
        <tbody>
            <table-row v-on:removeOvertimeEmployee="removeOvertimeEmployee" v-bind:employee="employee" v-for="(employee, index) in overtimeEmployees" :key="index">
                
            </table-row>
        </tbody>
    </v-simple-table>
</template>

<script>
import { db } from '../firebase/index'
import TableRow from './TableRow.vue'

export default {
  components: {
    TableRow
  },
  data() {
    return {
        overtimeEmployees: [],
    }
  },
  methods: {
      removeOvertimeEmployee(id) {
          const updatedOvertimeEmployees = this.overtimeEmployees.filter(employee => employee.expediente_id != id);

          this.overtimeEmployees = updatedOvertimeEmployees;
      }
  },
  async created() {
    const expedientesSnapshot = await db.collection('Tabela_Expediente').where("aguardando_justificativa", "==", true).get()
    const expedientes = expedientesSnapshot.docs.map((docSnapshot) => ({ data: docSnapshot.data(), id: docSnapshot.id }))
    console.log(expedientes)
    const employeesSnapshot = await db.collection('Tabela_Funcionario').get()
    const employees = employeesSnapshot.docs.map((docSnapshot) => ({ data: docSnapshot.data(), id: docSnapshot.id }))

    const allEmployeesData = []

    for (const expediente of expedientes) {
        const employee = employees.find((employee) => employee.id === expediente.data.ID_Funcionario) 
        if (!employee) continue 

        allEmployeesData.push({
            ra: employee.data.RA_cracha,
            entrada: expediente.data.DateTime_Entrada,
            saida: expediente.data.DateTime_Saida,
            nome: employee.data.Nome,
            expediente_id: expediente.id
        })
    }
    this.overtimeEmployees = allEmployeesData
  },
};
</script>