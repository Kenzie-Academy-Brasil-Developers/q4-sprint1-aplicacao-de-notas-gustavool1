# Rubrica da Entrega
## Aplicação de notas

| Critérios | Pontos |
|-|-|
| **Cadastro de Usuário**:<br>POST /users retorna 201 e o objeto criado, incluindo o array de anotações e o uuid gerado | 1 |
| **Listagem de Usuários**:<br>GET /users retorna 200 e o array com a lista de usuários. | 1 |
| **Middleware de verificação de CPF**:<br>Criar e utilizar um middleware que verifica a existência de um CPF já cadastrado e retorna 404 com uma mensagem de erro caso o CPF não seja encontrado.| 1 |
| **Atualização de Usuário**:<br>PATCH /users/&lt;cpf> retorna 200 e um objeto que contém uma mensagem de sucesso e a lista de usuários atualizada. | 1 |
| **Exclusão de Usuário**:<br>DELETE /users/&lt;cpf> retorna 204 sem mensagem | 1 |
| **Cadastro de Anotação**:<br>POST /users/&lt;cpf>/notes retorna 201 e um objeto com uma mensagem indicando que a anotação foi criada para o determinado usuário. | 1 |
| **Listagem de Anotações de um Usuário**:<br>GET /users/&lt;cpf>/notes/&lt;id> retorna 200 e o array com a lista de anotações do usuário dono do CPF passado na URL. | 1 |
| **Atualização de Anotação**:<br> PATCH /users/&lt;cpf>/notes/&lt;id> retorna 200 e a anotação do usuário atualizada.| 1 |
| **Exclusão de Anotação**:<br>DELETE /users/&lt;cpf>/notes/&lt;id> retorna 204 sem mensagem | 1 |
| **UUID**:<br>Utilizou corretamente o uuid e versão que condiz com os requisitos. | 1 |