function _loadWasmModule (sync, filepath, src, imports) {
  function _instantiateOrCompile(source, imports, stream) {
    var instantiateFunc = stream ? WebAssembly.instantiateStreaming : WebAssembly.instantiate;
    var compileFunc = stream ? WebAssembly.compileStreaming : WebAssembly.compile;

    if (imports) {
      return instantiateFunc(source, imports)
    } else {
      return compileFunc(source)
    }
  }

  
var buf = null;
var isNode = typeof process !== 'undefined' && process.versions != null && process.versions.node != null;
if (isNode) {
  
buf = Buffer.from(src, 'base64');

} else {
  
var raw = globalThis.atob(src);
var rawLength = raw.length;
buf = new Uint8Array(new ArrayBuffer(rawLength));
for(var i = 0; i < rawLength; i++) {
   buf[i] = raw.charCodeAt(i);
}

}


  if(sync) {
    var mod = new WebAssembly.Module(buf);
    return imports ? new WebAssembly.Instance(mod, imports) : mod
  } else {
    return _instantiateOrCompile(buf, imports, false)
  }
}

function wasm(imports){return _loadWasmModule(0, null, 'AGFzbQEAAAABBwFgAnx8AXwDAgEABAUBcAEBAQUDAQAABhQDfwBBCAt/AUGIgAILfwBBiIACCwcQAgNhZGQAAAZtZW1vcnkCAAkGAQBBAQsACgoBCAAgACABoA8L', imports)}

async function instantiate(module, imports = {}) {
  const { exports } = await WebAssembly.instantiate(module, imports);
  return exports;
}

async function main() {
    const { add } = await instantiate(await wasm(), { env: {} });
    return add(5, 6);
}

export { main };
