function env(name) {
  return (
    window?.configs?.[`VITE_${name}`] ||
    window?.configs?.[name] ||
    import.meta.env?.[`VITE_${name}`] ||
    import.meta.env[name]
  );
}

export default env;
