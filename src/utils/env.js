function env(name) {
  return process.env[name] || window?.configs?.[name] || import.meta.env[name];
}

export default env;
