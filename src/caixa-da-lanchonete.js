class CaixaDaLanchonete {
    constructor(){        
    }
    
    calcularValorDaCompra(metodoDePagamento, itens) {
        var objForma = new FormaDePagamento();
        var validaFormaResultado = objForma.validaTipo(metodoDePagamento);
        var tipoPagamento

        if(validaFormaResultado.validou == false){
            return validaFormaResultado.erro;
        }

        tipoPagamento = objForma.get(metodoDePagamento);

        if(itens && itens.length > 0){
            var error, produto, listaProdutos = [];
            var objProduto = new Produto();

            for(var i in itens){
                produto = objProduto.buscaProduto(itens[i]);                

                if(produto){
                    if(produto.quantidade == 0){
                        error = 'Quantidade inválida!';
                        break; 
                    }else{
                        listaProdutos.push(produto);
                    }
                }else{
                    error = 'Item inválido!'
                    break;
                }    
            }

            if(error){
                return error;
            }

            if(this.validaItens(listaProdutos)){
                return 'Item extra não pode ser pedido sem o principal';
            }

            if(!error){
                return this.calculaCompra(listaProdutos, tipoPagamento);
            }else{
                return error;
            }   
        }else{
            return 'Não há itens no carrinho de compra!';
        }
    }

    calculaCompra(listaProdutos, tipoPagamento){
        var valorTotal = 0;

        listaProdutos.forEach(function(item){
            valorTotal += item.valor * item.quantidade;
        });

        valorTotal = tipoPagamento.calculo(valorTotal);

        return 'R$ '+ valorTotal.toFixed(2).replaceAll('.',',');
    };

    validaItens(items){
        var temErro = false;
        var listaPrincipais = [];

        items.forEach(function(item){
            if(item.principal){
                listaPrincipais.push(item.id);
            }
        });

        for(var x in items){
            if(items[x].principal == false && !listaPrincipais.includes(items[x].depende[0])){
                temErro = true;
                break;
            }
        }
        

        return temErro;
    }

}
class Produto {
    constructor(id, n, v, p, d){
        this.id = id;
        this.nome = n;
        this.valor = v;
        this.principal = p;
        this.quantidade;
        this.depende = d;
    }

    buscaProduto(item){
        var produtos = this.getTodosProdutos();
        var produto;
        var tempItem = item.split(',');

        for(var p in produtos){
            if(tempItem[0] == produtos[p].id){
                produtos[p].quantidade = parseInt(tempItem[1]);
                produto = Object.assign({}, produtos[p]);
            }
        }        

        return produto;
    }

    getTodosProdutos(){
        return [
            new Produto('cafe','Café',3,true),
            new Produto('chantily','Chantily',1.50,false,['cafe']),
            new Produto('suconatural','Suco Natural',6.20,true),
            new Produto('sanduiche','Sanduíche',6.50,true),
            new Produto('queijo','Queijo',2,false,['sanduiche']),
            new Produto('salgado','Salgado',7.25,true),
            new Produto('combo1','1 Suco e 1 Saduíche',9.50,true,),
            new Produto('combo2','1 Café e 1 Saunduíche',7.50,true),
        ];
    }
}

class FormaDePagamento {
    constructor(){
        this.tipos = {
            "dinheiro": function(valor){
                return  valor - (valor*.05);
            },
            "credito": function(valor){
                return  valor + (valor*.03);
            },
            "debito": function(valor){
                return  valor;
            }
        };
    }

    get(forma){
        return {
            tipo: forma,
            calculo: this.tipos[forma]
        }
    }

    validaTipo (forma){
        if (forma && this.tipos[forma] !== undefined){
            return {validou: true};    
        } else {
            return {validou:false, erro: "Forma de pagamento inválida!"};
        }
    }   
}

export { CaixaDaLanchonete };