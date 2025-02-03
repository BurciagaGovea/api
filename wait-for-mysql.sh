#!/bin/sh
set -e

echo "⏳ Esperando a que MySQL esté disponible..."
while ! nc -z "$MYSQLDB_HOST" 3306; do
    echo "⌛ MySQL aún no está listo. Esperando..."
    sleep 2
done

echo "✅ MySQL está disponible. Iniciando aplicación..."
exec "$@"
