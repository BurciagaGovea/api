#!/bin/sh
set -e

# Validar que las variables necesarias están definidas
if [ -z "$MYSQLDB_HOST" ]; then
    echo "❌ Error: La variable MYSQLDB_HOST no está definida."
    exit 1
fi

echo "⏳ Esperando a que MySQL esté disponible en $MYSQLDB_HOST:3306..."
while ! nc -z "$MYSQLDB_HOST" 3306; do
    echo "⌛ MySQL aún no está listo. Esperando..."
    sleep 2
done

echo "✅ MySQL está disponible. Iniciando aplicación..."
exec "$@"
