<template>
    <tr>
        <td>{{ employee.nome }}</td>
        <td>{{ employee.ra }}</td>
        <td>{{ employee.entrada.toDate().toLocaleString() }}</td>
        <td>{{ employee.saida.toDate().toLocaleString() }}</td>
        <td>
            <v-text-field
                color="gray"
                v-model="justification"
            >
                <v-icon
                    slot="append"
                    color="green"
                    v-on:click="updateJustification(employee)"
                >
                    mdi-check-circle-outline
                </v-icon>
            </v-text-field>
        </td>    
    </tr>
</template>

<script>
import { db } from '../firebase/index'

export default {
    data() {
        return {
            justification: ''
        }
    },
    props: {
        employee: Object
    },
    methods: {
      updateJustification: async function (employee) {
            const expedienteRef = db.collection('Tabela_Expediente').doc(employee.expediente_id);
            await expedienteRef.update({ HoraExtra_Justificativa: this.justification, aguardando_justificativa: false });
            this.justification = '';
            this.$emit("removeOvertimeEmployee", employee.expediente_id);
      }
    }

}

</script>

