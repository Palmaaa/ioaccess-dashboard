<template>
    <tr>
        <td>{{ employee.nome }}</td>
        <td>{{ employee.ra }}</td>
        <td>
                <v-btn
                @click="selectEmployee(employee)"
                >Relatório individual</v-btn>
        </td>
           
    </tr>
</template>

<script>

export default {
    data: function (){
        return {
           
             
        }
    },
    props: {
        employee: Object,
    },
    methods: {
      selectEmployee: async function (employee) {
           
            this.$emit("insertSelectedEmployee", employee.id);
         

      }
    }

}

</script>

