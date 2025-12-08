# 🚀 Guia Rápido - Git & GitHub

## 📤 Enviar Mudanças para o GitHub

Sempre que você fizer alterações no código e quiser enviar para o GitHub:

```bash
# 1. Adicionar todos os arquivos modificados
git add .

# 2. Criar um commit com mensagem descritiva
git commit -m "Descrição do que você mudou"

# 3. Enviar para o GitHub
git push
```

### Exemplo prático:
```bash
git add .
git commit -m "Ajustei a cor do botão e corrigi bug no login"
git push
```

---

## 📥 Baixar Mudanças do GitHub

Se você trabalhar em outro computador ou alguém fizer mudanças:

```bash
git pull
```

---

## 🔍 Ver Status das Mudanças

Para ver quais arquivos foram modificados:

```bash
git status
```

---

## 📜 Ver Histórico de Commits

```bash
git log --oneline
```

---

## ⚡ Comandos Úteis

### Desfazer mudanças em um arquivo (antes do commit):
```bash
git restore nome-do-arquivo.tsx
```

### Ver diferenças do que foi modificado:
```bash
git diff
```

### Criar uma nova branch:
```bash
git checkout -b nome-da-branch
```

---

## 🎯 Fluxo de Trabalho Diário

1. **Antes de começar a trabalhar:**
   ```bash
   git pull
   ```

2. **Depois de fazer mudanças:**
   ```bash
   git add .
   git commit -m "Descrição clara do que fiz"
   git push
   ```

---

## 🆘 Problemas Comuns

### "Updates were rejected" ao fazer push:
```bash
git pull --rebase
git push
```

### Esqueci de fazer pull antes de começar:
```bash
git stash
git pull
git stash pop
```

---

## 📌 Seu Repositório

**URL:** https://github.com/oliveiraclick/morador

**Branch principal:** master

---

💡 **Dica:** Faça commits pequenos e frequentes com mensagens claras!
