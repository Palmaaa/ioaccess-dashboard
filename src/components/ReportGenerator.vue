
<template>
    <v-card
        elevation="1"
    >
        <canvas id="myChart" ref="myChart" style="position:absolute;left:-9999px;top:-9999p"></canvas>
        <v-card-title>Gerar relatórios</v-card-title>

        <v-row>
            <v-col
            cols="12"
            sm="4"
            >
            <v-date-picker
                    v-model="date"
                    locale="pt-br"
                    :max="new Date().toISOString().substr(0, 10)"
                    range
                    ></v-date-picker>
            <v-text-field
                    v-model="dateRangeText"
                    label="Intervalo de tempo"
                    prepend-icon="mdi-calendar"
                    readonly
                    ></v-text-field>
            </v-col>
            <v-col
            cols="12"
            sm="8"
            >
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
                                Gerar
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <table-row v-on:insertSelectedEmployee="insertSelectedEmployee" v-bind:employee="employee" v-for="(employee, index) in allEmployees" :key="index">
                            
                        </table-row>
                    </tbody>
                </v-simple-table>
                
              
            </v-col>
        </v-row>
        <v-btn block
        @click="createPDF()">
            RELATÓRIO GLOBAL
        </v-btn>
    </v-card>
    
</template>

<script>
import { db } from '../firebase/index'
import TableRow from './TableRowReport.vue'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import Chart from "chart.js";
function nextDay(day){
    return day + 86400000
}

function createLineChart(colors_, labels_,data_, title){
     // Converting chart to image and inserting in doc
     var ch = new Chart(document.getElementById("myChart").getContext('2d'), {
                    type: 'line',
                    data: {
                        labels: labels_,
                        datasets: [{
                            label: title,
                            data: data_,
                            backgroundColor:'rgba(255, 255, 255, 0.1)',
                            borderColor: colors_,
                            pointBackgroundColor: colors_,
                            pointBorderColor: colors_,
                            pointRadius: 10
                            
                        }]
                    },
                    options: {
                        scales: {
                            yAxes: [{
                                ticks: {
                                    beginAtZero: true
                                }
                            }]
                        },
                        animation: {
                            
                            onComplete: function() {
                                var a = document.createElement('a');
                                a.href = ch.toBase64Image();
                                a.download = title+'.png';

                                // Trigger the download
                                a.click();
                            }
                        }
                        
                    }
                });
                
}

function createChart(data_, title){
     // Converting chart to image and inserting in doc
     var ch = new Chart(document.getElementById("myChart").getContext('2d'), {
                    type: 'bar',
                    data: {
                        labels: ['Vermelho', 'Amarelo', 'Verde'],
                        datasets: [{
                            label: title,
                            data: data_,
                            backgroundColor: [
                                'rgba(255, 99, 132, 1)',
                                'rgba(255, 206, 86, 1)',
                                'rgba(50,205,50, 1)'
                            ],
                            borderColor: [
                                'rgba(255, 99, 132, 1)',
                                'rgba(255, 206, 86, 1)',
                                'rgba(50,205,50, 1)'
                            ],
                            borderWidth: 1
                        }]
                    },
                    options: {
                        scales: {
                            yAxes: [{
                                ticks: {
                                    beginAtZero: true
                                }
                            }]
                        },
                        animation: {
                            
                            onComplete: function() {
                                var a = document.createElement('a');
                                a.href = ch.toBase64Image();
                                a.download = title+'.png';

                                // Trigger the download
                                a.click();
                            }
                        }
                        
                    }
                });
                
}

function dateConvert(date){
    var sp = date.split('-')
    return sp[2] + "/" + sp[1] + "/" + sp[0]
}
  export default {
      
    components: {
        TableRow
    },
    data: () => ({
      date:  [new Date().toISOString().substr(0, 10), new Date().toISOString().substr(0, 10)],
      allEmployees: [],
      moreText: [
        "Gráficos com os dados da coleta dos formulários de humor gerados no formato .png na pasta de downloads do seu navegador"
      ],
      items: [
        
      ]
    }),
    computed: {
      dateRangeText () {
        var text;
        text = dateConvert(this.date[0])
        if(this.date[1] != null){
            text = text + " até " + dateConvert(this.date[1])
        }
        return text
      },
    },
     methods: {
      async insertSelectedEmployee(id) {
          
          var docRef = db.collection("Tabela_Funcionario").doc(id);

            docRef.get().then(async (doc) => {
                if (doc.exists) {
                    if(this.date[1] == null)
                        this.date[1] = this.date[0]
                    var timeEntrada = new Date(this.date[0])
                    var timeSaida = new Date(this.date[1])
                    if(timeEntrada > timeSaida)
                    {
                        var temp = timeEntrada
                        timeEntrada = timeSaida
                        timeSaida = temp
                    }
                     console.log("Document data:", doc.data());
                     var txtInterval = "Dados coletados entre " + dateConvert(this.date[0]) + " e " + dateConvert(this.date[1])
       
                     this.moreText.push(txtInterval)
                     let pdfName = 'relatorio_'+doc.get("Nome") + '_' + dateConvert(this.date[0]) + " até " + dateConvert(this.date[1]) 
                      const columns = [
                        { title: "Entrada", dataKey: "entrada" },
                        { title: "Saída", dataKey: "saida" },
                        { title: "Humor entrada", dataKey: "hentrada" },
                        { title: "Humor saída", dataKey: "hsaida" },
                        { title: "Horas extras(h)", dataKey: "h_extras" },
                        { title: "Justificativa", dataKey: "just" }

                    ];
                    const document = new jsPDF({
                        orientation: "portrait",
                        unit: "in",
                        format: "letter"
                    });
                    // text is placed using x, y coordinates
                    document.setFontSize(16).text("VISÃO GERAL DOS EXPEDIENTES", 0.5, 1.0);
                    // create a line under heading 
                    document.setLineWidth(0.01).line(0.5, 1.1, 8.0, 1.1);
                    // Using autoTable plugin

                    //CALCULATED
                    const expedienteSnapshot = await db.collection('Tabela_Expediente').where("ID_Funcionario", "==", id).get()
                    const exps = expedienteSnapshot.docs.map((docSnapshot) => ({ data: docSnapshot.data(), id: docSnapshot.id }))
                   
                    

                    var vermelho_ = 'rgba(255, 99, 132, 1)'
                    var amarelo_ = 'rgba(255, 206, 86, 1)'
                    var verde_ = 'rgba(50,205,50, 1)'

                    var day_by_day = timeEntrada.getTime();
                    var labels_ = ['Inicio']
                    var colors_ = [amarelo_]
                    var data_ = [0]
                    var pointer = 0

                    
                    var labels_S = ['Inicio']
                    var colors_S = [amarelo_]
                    var data_S = [0]
                    var pointerS = 0
   

                  
                       
                    for (const exp of exps) {
                           
                        const expedient = exp
                        if(expedient.data.DateTime_Entrada.toDate().getTime() >= timeEntrada.getTime()
                        &&  expedient.data.DateTime_Saida.toDate().getTime() <= nextDay(timeSaida.getTime())){
                            var hrExp = (((expedient.data.DateTime_Saida.toDate().getTime()) - (expedient.data.DateTime_Entrada.toDate().getTime()))/(3600000))
                            var jus = "-"
                            if(hrExp <= doc.get("Expediente")){
                                hrExp = 0
                            } else{
                                hrExp = (hrExp - doc.get("Expediente"))
                                jus = expedient.data.HoraExtra_Justificativa
                            }
                            
                            this.items.push({entrada: expedient.data.DateTime_Entrada.toDate().toLocaleString(),
                             saida:  expedient.data.DateTime_Saida.toDate().toLocaleString(),
                              hentrada: expedient.data.HumorEntrada,
                               hsaida: expedient.data.HumorSaida,
                               h_extras: parseInt(hrExp),
                               just: jus })
                        }                
                            
                    }
                    do{
                        for (const expedient of exps) {
                            if(expedient.data.DateTime_Entrada.toDate().getTime() >= day_by_day &&
                            (expedient.data.DateTime_Entrada.toDate().getTime() - 86400000) < day_by_day) {
                                if(expedient.data.HumorEntrada == "verde"){
                                    data_.push(data_[pointer] + 1)
                                    colors_.push(verde_)
                                    labels_.push(dateConvert(new Date(day_by_day).toISOString().substr(0, 10)))

                                }
                                    
                                
                                if(expedient.data.HumorEntrada == "vermelho"){
                                    data_.push(data_[pointer] - 1)
                                    colors_.push(vermelho_)
                                    labels_.push(dateConvert(new Date(day_by_day).toISOString().substr(0, 10)))
                                }
                                    
                                    
                                if(expedient.data.HumorEntrada == "amarelo"){
                                    data_.push(data_[pointer])
                                    colors_.push(amarelo_)
                                    labels_.push(dateConvert(new Date(day_by_day).toISOString().substr(0, 10)))
                                }
<<<<<<< Updated upstream


                                if(expedient.data.HumorSaida == "verde"){
                                    data_S.push(data_S[pointer] + 1)
                                    colors_S.push(verde_)
                                    labels_S.push(dateConvert(new Date(day_by_day).toISOString().substr(0, 10)))

                                }
                                    
                                
                                if(expedient.data.HumorSaida == "vermelho"){
                                    data_S.push(data_S[pointer] - 1)
                                    colors_S.push(vermelho_)
                                    labels_S.push(dateConvert(new Date(day_by_day).toISOString().substr(0, 10)))
                                }
                                    
                                    
                                if(expedient.data.HumorSaida == "amarelo"){
                                    data_S.push(data_S[pointer])
                                    colors_S.push(amarelo_)
                                    labels_S.push(dateConvert(new Date(day_by_day).toISOString().substr(0, 10)))
                                }
                                day_by_day = nextDay(day_by_day)
                                pointer++
=======
                                if(expedient.data.DateTime_Saida != null){
                                    if(expedient.data.DateTime_Saida.toDate().getTime() <= nextDay(timeSaida.getTime())){
                                        if(expedient.data.HumorSaida == "verde"){
                                            data_S.push(data_S[pointer] + 1)
                                            colors_S.push(verde_)
                                            labels_S.push(dateConvert(new Date(day_by_day).toISOString().substr(0, 10)))

                                        }
                                            
                                        
                                        if(expedient.data.HumorSaida == "vermelho"){
                                            data_S.push(data_S[pointer] - 1)
                                            colors_S.push(vermelho_)
                                            labels_S.push(dateConvert(new Date(day_by_day).toISOString().substr(0, 10)))
                                        }
                                            
                                            
                                        if(expedient.data.HumorSaida == "amarelo"){
                                            data_S.push(data_S[pointer])
                                            colors_S.push(amarelo_)
                                            labels_S.push(dateConvert(new Date(day_by_day).toISOString().substr(0, 10)))
                                        }
                                    }
                                }
                            }              
                        }
                        day_by_day = nextDay(day_by_day)
                        if(data_.length > pointer + 1)
                            pointer++
                        if(data_S.length > pointerS + 1)
                            pointerS++

                        
                    }while(day_by_day < nextDay(timeSaida.getTime()))
>>>>>>> Stashed changes

                            }           
                                
                        }
                         day_by_day = nextDay(day_by_day)
                    }while(day_by_day < timeSaida.getTime())
                     
                    document.autoTable({
                        columns,
                        body: this.items,
                        margin: { left: 0.5, top: 1.25 }
                         
                    });
                    
                    
                    
                    document
                        .setFont("times")
                        .setFontSize(11)
                        .setTextColor(0, 0, 0)
                        .text(
                        this.moreText,
                        0.5,
                        document.internal.pageSize.height - 0.5
                        ).save(pdfName + '.pdf');
                    createLineChart(colors_, labels_, data_, "Curva de Humor de Entrada de "+doc.get("Nome")+" entre " + dateConvert(this.date[0]) + " e " + dateConvert(this.date[1]));
                    createLineChart(colors_S, labels_S, data_S, "Curva de Humor de Saida de "+doc.get("Nome")+" entre " + dateConvert(this.date[0]) + " e " + dateConvert(this.date[1]));
                   this.moreText= [
                        "Gráficos com os dados da coleta dos formulários de humor gerados no formato .png na pasta de downloads do seu navegador"
                    ]
                    this.items= [ ]
                   
                    
                } else {
                    // doc.data() will be undefined in this case
                    console.log("No such document!");
                }
            }).catch((error) => {
                console.log("Error getting document:", error);
            });
         
          
      },
      async createPDF () {
        if(this.date[1] == null)
            this.date[1] = this.date[0]
        var timeEntrada = new Date(this.date[0])
        var timeSaida = new Date(this.date[1])
        if(timeEntrada > timeSaida)
        {
            var temp = timeEntrada
            timeEntrada = timeSaida
            timeSaida = temp
        }

        var txtInterval = "Dados coletados entre " + dateConvert(this.date[0]) + " e " + dateConvert(this.date[1])
        let pdfName = 'relatorio_global' + ' de ' + dateConvert(this.date[0]) + " até " + dateConvert(this.date[1])
        this.moreText.push(txtInterval)

        const columns = [
        { title: "Nome", dataKey: "nome" },
        { title: "RA", dataKey: "ra" },
        { title: "Humor predominate (entrada)", dataKey: "h_entrada" },
        { title: "Humor predominate (saída)", dataKey: "h_saida" },
        { title: "Horas extras trabalhadas (h)", dataKey: "hrs_extras" }

      ];
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "in",
        format: "letter"
      });
      // text is placed using x, y coordinates
      doc.setFontSize(16).text("VISÃO GERAL DOS FUNCIONÁRIOS", 0.5, 1.0);
      // create a line under heading 
      doc.setLineWidth(0.01).line(0.5, 1.1, 8.0, 1.1);
      //get and calculate employees data
      const expedienteSnapshot = await db.collection('Tabela_Expediente').get()
        const exps = expedienteSnapshot.docs.map((docSnapshot) => ({ data: docSnapshot.data(), id: docSnapshot.id }))
        var contVermelhoE = 0, contAmareloE = 0, contVerdeE = 0, contVermelhoS = 0, contAmareloS = 0, contVerdeS = 0
        var globalVermelhoE = 0, globalAmareloE = 0, globalVerdeE = 0, globalVermelhoS = 0, globalAmareloS = 0, globalVerdeS = 0
        var hrExtraExp = 0, hrExtraEmp = 0
       

        for(const emp of this.allEmployees){
            contVermelhoE = 0
            contAmareloE = 0
            contVerdeE = 0
            contVermelhoS = 0
            contAmareloS = 0
            contVerdeS = 0
            hrExtraEmp = 0
            for (const exp of exps) {
                
                const expedient = exp
                if(expedient.data.DateTime_Entrada.toDate().getTime() >= timeEntrada.getTime()
                 &&  expedient.data.DateTime_Saida.toDate().getTime() <= nextDay(timeSaida.getTime())){
                    if(expedient.data.ID_Funcionario == emp.id){
                        
                        if(expedient.data.HumorEntrada == "verde")
                            contVerdeE++
                        
                        if(expedient.data.HumorEntrada == "vermelho")
                            contVermelhoE++
                            
                        if(expedient.data.HumorEntrada == "amarelo")
                            contAmareloE++
                            
                        if(expedient.data.HumorSaida == "verde")
                            contVerdeS++
                        
                        if(expedient.data.HumorSaida == "vermelho")
                            contVermelhoS++
                            
                        if(expedient.data.HumorSaida == "amarelo")
                            contAmareloS++
                        
                        hrExtraExp = (((expedient.data.DateTime_Saida.toDate().getTime()) - (expedient.data.DateTime_Entrada.toDate().getTime()))/(3600000))
                        if(hrExtraExp > emp.exp){
                            hrExtraEmp += (hrExtraExp - emp.exp)
                        }
                    }

                }                
                
            }
            var hEntrada = ""
            var hSaida = ""
            var arEntrada = [contVerdeE, contVermelhoE, contVermelhoE]
            arEntrada.sort()
            if(arEntrada[2] == contVerdeE)
                hEntrada = "Verde"
            if(arEntrada[2] == contVermelhoE)
                hEntrada = "Vermelho"
            if(arEntrada[2] == contAmareloE)
                hEntrada = "Amarelo"

            var arSaida = [contVerdeS, contVermelhoS, contVermelhoS]
            arSaida.sort()
            if(arSaida[2] == contVerdeS)
                hSaida = "Verde"
            if(arSaida[2] == contVermelhoS)
                hSaida = "Vermelho"
            if(arSaida[2] == contAmareloS)
                hSaida = "Amarelo"

            this.items.push({nome: emp.nome, ra: emp.ra, h_entrada: hEntrada, h_saida: hSaida, hrs_extras: parseInt(hrExtraEmp) })
            globalVerdeE += contVerdeE
            globalVermelhoE += contVermelhoE
            globalAmareloE += contAmareloE
            globalVerdeS += contVerdeS
            globalVermelhoS += contVermelhoS
            globalAmareloS += contAmareloS
        }
            

      // Using autoTable plugin
       
      doc.autoTable({
        columns,
        body: this.items,
        margin: { left: 0.5, top: 1.25 }
      });
  
      
     
      doc
        .setFont("times")
        .setFontSize(11)
        .setTextColor(0, 0, 0)
        .text(
          this.moreText,
          0.5,
          doc.internal.pageSize.height - 0.5
        )
        .save(pdfName + '.pdf');
        createChart([globalVermelhoE,globalAmareloE,globalVerdeE], "Humor na Entrada (Global)  entre " + dateConvert(this.date[0]) + " e " + dateConvert(this.date[1]));
        createChart([globalVermelhoS,globalAmareloS,globalVerdeS], "Humor na Saída (Global)  entre " + dateConvert(this.date[0]) + " e " + dateConvert(this.date[1]));
         this.moreText= [
        "Gráficos com os dados da coleta dos formulários de humor gerados no formato .png na pasta de downloads do seu navegador"
      ]
      this.items= [ ]

     },
    },
    async created() {
        
        const employeesSnapshot = await db.collection('Tabela_Funcionario').get()
        const employees = employeesSnapshot.docs.map((docSnapshot) => ({ data: docSnapshot.data(), id: docSnapshot.id }))

        const allEmployeesData = []

        for (const emp of employees) {
            const employee = emp 

            allEmployeesData.push({
                ra: employee.data.RA_cracha, 
                nome: employee.data.Nome,
                id: employee.id,
                exp: employee.data.Expediente
            })
        }
        console.log(allEmployeesData)
        this.allEmployees = allEmployeesData
    },
    
  }
  
</script>