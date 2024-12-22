alias w := watch

watch:
  cargo watch -x "loco start" --ignore="*.sqlite*"
