<template>
    <tr>
        <td>
            <v-text-field
                color="gray"
                v-model="nome"
            />
        </td>
        <td>
            <v-text-field
                color="gray"
                v-model="ra"
            />
        </td>
        <td>
            <v-text-field
                color="gray"
                v-model="expediente"
            />
        </td>
        <td>
            <v-select
                color="gray"
                v-model="gestor"
                :items="gestores"
                item-text="nome"
                item-value="id"
                return-object
            />
        </td>
        <td></td>
        <td>
            <v-icon
                color="gray"
                v-on:click="save()"
            >
                mdi-check-circle-outline
            </v-icon>
        </td>
    </tr>

</template>

<script>
import { db } from '../firebase/index'

export default {
    data() {
        return {
            nome: '',
            ra: '',
            expediente: undefined,
            gestor: { nome: '', id: '' },
            gestores: [{nome: '', id: ''}]
        }
    },
    props: {
        employee: Object
    },
    methods: {
        async save() {
            try {
                const isInvalid = !(this.nome != '' && 
                                    this.ra != '' && 
                                    this.expediente != '' && 
                                    this.gestor.id != '') 
                if (isInvalid) {
                    throw new Error()
                }
                const employeeDTO = {
                    Expediente: this.expediente,
                    ID_Gestor: this.gestor.id,
                    Nome: this.nome,
                    RA_cracha: this.ra
                }
                const insertedEmployee = await db.collection('Tabela_Funcionario').add(employeeDTO)

                const formattedEmployee = {
                    data: {
                        Expediente: this.expediente,
                        ID_Gestor: this.gestor.id,
                        Nome: this.nome,
                        RA_cracha: this.ra
                    },
                    id: insertedEmployee.id
                }
                this.$emit("addEmployee", formattedEmployee);

                this.nome = ''
                this.ra = ''
                this.expediente = undefined
                this.gestor = { nome: '', id: '' }
            } catch (err) {
                alert('Verifique os campos')
            }
        },
    },
    async created() {
        const gestoresSnapshot = await db.collection('Tabela_Gestor').get()
        const gestores = gestoresSnapshot.docs.map((docSnapshot) => ({ data: docSnapshot.data(), id: docSnapshot.id }))
        const formattedGestores = gestores.map(gestor => ({ nome: gestor.data.Nome, id: gestor.id }))
        this.gestores = formattedGestores

    }
}

</script>