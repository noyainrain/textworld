# Wintery Scene

## Get the Code

Clone the Git repository at https://github.com/noyainrain/textworld.git and switch to the `wintery`
branch.

## System Requirements

The following software must be installed on your system:

* Node.js >= 18.20

## Installing Dependencies

To install all dependencies, run:

```sh
npm --prefix=client update --no-package-lock
```

## Rendering Your Wintery Scene

Serve your wintery scene with:

```sh
python3 -m http.server --directory=client
```

You can see it at http://localhost:8000/examples/wintery.html .

## Editing Your Wintery Scene

You can edit your wintery scene at `client/examples/wintery.js`.

For an example see `client/demo/demo.js` and http://localhost:8000/demo/demo.html .
