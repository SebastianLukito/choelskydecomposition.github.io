function generateMatrix() {
    const rows = parseInt(document.getElementById('rows').value);
    const columns = parseInt(document.getElementById('columns').value);
  
    if (isNaN(rows) || isNaN(columns) || rows <= 0 || columns <= 0) {
      alert('Please enter valid rows and columns.');
      return;
    }
  
    const matrixInputHtml = createMatrixTable(rows, columns);
  
    document.getElementById('matrixInput').innerHTML = matrixInputHtml;
  }
  
  function createMatrixTable(rows, columns) {
    let matrixTableHtml = '<label for="matrix">Matrix:</label>';
    matrixTableHtml += '<table id="matrixTable">';
  
    for (let i = 0; i < rows; i++) {
      matrixTableHtml += '<tr>';
      for (let j = 0; j < columns; j++) {
        matrixTableHtml += `<td><input type="number" id="matrix${i}_${j}" placeholder="(${i + 1},${j + 1})"></td>`;
      }
      matrixTableHtml += '</tr>';
    }
  
    matrixTableHtml += '</table>';
    return matrixTableHtml;
  }

  function choleskyDecomposition() {
    const rows = parseInt(document.getElementById('rows').value);
    const columns = parseInt(document.getElementById('columns').value);
  
    // Retrieve matrix elements from user input
    const matrix = [];
    for (let i = 0; i < rows; i++) {
      matrix[i] = [];
      for (let j = 0; j < columns; j++) {
        matrix[i][j] = parseFloat(document.getElementById(`matrix${i}_${j}`).value);
      }
    }
  
    // Validate the matrix for Cholesky decomposition
    if (!isSymmetricPositiveDefinite(matrix)) {
      alert('Please enter a valid symmetric positive definite matrix.');
      return;
    }
  
    // Perform Cholesky decomposition
    const resultMatrix = choleskyDecompose(matrix);
  
    // Display the result
    displayCholeskyResult(resultMatrix);
  }
  
  function displayCholeskyResult(resultMatrix) {
    const rows = resultMatrix.length;
    const columns = resultMatrix[0].length;
  
    let resultHtml = '<h3>Cholesky Decomposition Result:</h3>';
    resultHtml += '<p>Lower Triangular Matrix (L):</p>';
    resultHtml += '<table border="1">';
  
    for (let i = 0; i < rows; i++) {
      resultHtml += '<tr>';
      for (let j = 0; j < columns; j++) {
        resultHtml += `<td>${resultMatrix[i][j].toFixed(4)}</td>`;
      }
      resultHtml += '</tr>';
    }
  
    resultHtml += '</table>';
    document.getElementById('result').innerHTML = resultHtml;
  }
  
  function isSymmetricPositiveDefinite(matrix) {
    // Check if the matrix is symmetric
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < i; j++) {
        if (matrix[i][j] !== matrix[j][i]) {
          return false;
        }
      }
    }
  
    // Check if the matrix is positive definite
    for (let i = 0; i < matrix.length; i++) {
      if (det(matrix.slice(0, i + 1).map(row => row.slice(0, i + 1))) <= 0) {
        return false;
      }
    }
  
    return true;
  }
  
  function choleskyDecompose(matrix) {
    const n = matrix.length;
    const resultMatrix = new Array(n).fill().map(() => new Array(n).fill(0));
  
    for (let i = 0; i < n; i++) {
      for (let j = 0; j <= i; j++) {
        let sum = 0;
        for (let k = 0; k < j; k++) {
          sum += resultMatrix[i][k] * resultMatrix[j][k];
        }
  
        if (i === j) {
          resultMatrix[i][j] = Math.sqrt(matrix[i][i] - sum);
        } else {
          resultMatrix[i][j] = (matrix[i][j] - sum) / resultMatrix[j][j];
        }
      }
    }
  
    return resultMatrix;
  }
  
  function det(matrix) {
    const n = matrix.length;
    if (n === 1) {
      return matrix[0][0];
    }
  
    let determinant = 0;
    for (let i = 0; i < n; i++) {
      determinant += matrix[0][i] * cofactor(matrix, 0, i);
    }
  
    return determinant;
  }
  
  function cofactor(matrix, row, col) {
    return Math.pow(-1, row + col) * det(minor(matrix, row, col));
  }
  
  function minor(matrix, row, col) {
    return matrix.filter((_, i) => i !== row).map(row => row.filter((_, j) => j !== col));
  }
  