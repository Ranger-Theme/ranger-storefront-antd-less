import fs from "fs";
import path from "path";
import url from "url";
import consola from "consola";

const args = process.argv.slice(2)[0];

const autoTypescript = (filePath) => {
  const __filename = url.fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const dir = path.resolve(__dirname, filePath);

  if (fs.existsSync(dir)) {
    fs.readdir(
      dir,
      {
        encoding: "utf-8",
        withFileTypes: true,
      },
      (error, files) => {
        if (error) consola.error(new Error(error));

        files.forEach((file) => {
          const realPath = `${dir}/${file.name}`;

          if (file.isDirectory()) {
            autoTypescript(realPath);
          } else {
            const regex = /\.(js|jsx)$/;
            if (regex.test(file.name)) {
              fs.rename(realPath, realPath.replace(".js", ".ts"), (err) => {
                if (err) consola.error(new Error(err));

                consola.success({
                  message: `${realPath}  changed success.`,
                  badge: true,
                });
              });
            }
          }
        });
      }
    );
  } else {
    consola.error("This file path not exists...");
  }
};

autoTypescript(`../${args}`);
