//eslint-disable @typescript-eslint/type-annotation-spacing
//eslint-disable @typescript-eslint/dot-notation
import { Component, OnInit } from '@angular/core';
import { ProdutoService } from './../services/produto.service'; // importa o serviço do produto
import { Produto} from './../models/Produto'; // importa a classe do produto
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{
  // Variável que armazena a lista de produtos que será exibida
  public listaProdutos: Produto[] = [];

  // instancia o serviço do produto na variável prodService
  constructor(private prodService: ProdutoService,
    private alertController: AlertController) { }

    ngOnInit(){
      this.buscarProdutos(); // chamaa o método que busca todos os produtos no firebase
    }
    // Métodos para buscar todos os produtos no firebase
    buscarProdutos(){
      // chama o método de buscar produtos no firebae e se sobrescreve para receber o retorno
      // o retonro (registro) é armazenado na variavel dadosRetorno
      this.prodService.buscarProdutos().subscribe(dadosRetorno =>{
       // Percorre todos os registros que vieram no retorno e mapeia para a lista de produtos
        this.listaProdutos = dadosRetorno.map((registro:any)=>(
          {
            id: registro.payload.doc.id, // pega o Id do registro no firebase
            nome: registro.payload.doc.data()['nome'], // pega o nome do produto
            valor: registro.playload.doc.data()['valor'] // pega o valor do produto
          }
        )); // Fim do map
      }); // Fim do subscribe
    }
    // Métodos para deletar registros no Firebase após confirmação
    async deletarProduto(id: string){
      const alert = await this.alertController.create({
        header: 'Confirma exclusão deste produto?',
        buttons: [
          {
            text: 'Não',
            role: 'cancel',
            handler: ()=>{

            },
          },
          {
            text: 'Sim',
            role: 'confirm',
            handler: ()=>{
              this.prodService.deletar(id); // chama o serviço e deleta o registro no firebase
            },
          },
        ],
      });
      await alert.present();
      this.buscarProdutos(); // Recarrega a lista de Produtos
    }

}
