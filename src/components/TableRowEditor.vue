<template>
    <tr>
        <td>
            <v-text-field
                color="gray"
                v-model="nome"
                :disabled="isDisabled"
            />
        </td>
        <td>
            <v-text-field
                color="gray"
                v-model="ra"
                :disabled="isDisabled"
            />
        </td>
        <td>
            <v-text-field
                color="gray"
                v-model="expediente"
                :disabled="isDisabled"
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
                :disabled="isDisabled"
            />
        </td>
        <td>
            <v-icon
                color="gray"
                v-on:click="save()"
            >
                {{ isDisabled ? 'mdi-pencil' : 'mdi-check-circle-outline' }}
            </v-icon>
        </td>
        <td>
            <v-icon
                color="gray"
                v-on:click="remove()"
            >
                mdi-delete
            </v-icon>
        </td>
    </tr>

</template>

<script>
import { db } from '../firebase/index'

export default {
    data() {
        return {
            isDisabled: true,
            nome: '',
            ra: '',
            expediente: 0,
            gestor: { nome: '', id: '' },
            gestores: [{nome: '', id: ''}]
        }
    },
    props: {
        employee: Object
    },
    methods: {
        async save() {
            if (!this.isDisabled) {
                const funcionarioDTO = {
                    Expediente: this.expediente,
                    ID_Gestor: this.gestor.id,
                    Nome: this.nome,
                    RA_cracha: this.ra
                }
                const funcionarioRef = db.collection('Tabela_Funcionario').doc(this.employee.id);
                await funcionarioRef.update(funcionarioDTO);
            }
            this.isDisabled = !this.isDisabled
        },
        async remove() {
            const funcionarioRef = db.collection('Tabela_Funcionario').doc(this.employee.id);
            await funcionarioRef.delete();
            this.$emit("removeEmployee", this.employee.id);
        }
    },
    async created() {
        this.nome = this.employee.data.Nome
        this.ra = this.employee.data.RA_cracha
        this.expediente = this.employee.data.Expediente
        this.gestor.id = this.employee.data.ID_Gestor
    
        const gestoresSnapshot = await db.collection('Tabela_Gestor').get()
        const gestores = gestoresSnapshot.docs.map((docSnapshot) => ({ data: docSnapshot.data(), id: docSnapshot.id }))
        const formattedGestores = gestores.map(gestor => ({ nome: gestor.data.Nome, id: gestor.id }))
        this.gestores = formattedGestores

    }
}

</script>