# MathJax Extensions Demonstration

## AMS Package Extensions

### Align Environment
$$\begin{align}
a &= b \\
c &= d
\end{align}$$

### Gather Environment
$$\begin{gather}
2x + 3y = 7 \\
4x - y = 5
\end{gather}$$

### Multline Environment
$$\begin{multline}
f(x) = (x+1)^2(x-1)^2 \\
= (x^2 - 1)^2 \\
= x^4 - 2x^2 + 1
\end{multline}$$

### Flalign Environment
$$\begin{flalign}
x &= y && \text{(first equation)} \\
a &= b && \text{(second equation)}
\end{flalign}$$

### Cases Environment
$$f(x) = \begin{cases}
x^2 & \text{if } x \geq 0 \\
-x & \text{if } x < 0
\end{cases}$$

## Cancel Package

### Simple Cancel
$$\frac{\cancel{a} b}{c \cancel{a}} = \frac{b}{c}$$

### Backward Cancel
$$\frac{\bcancel{x} + \bcancel{x}}{2} = x$$

### Cross Cancel
$$\xcancel{x + y}$$

## Color Extension

### Color Commands
$${\color{red} \text{Red text}}$$

### Background Color
$$\colorbox{yellow}{x + y}$$

### Fit Box
$$\bbox[border:2px solid red]{x^2 + y^2 = z^2}$$

## Enclose Extension

### Enclose with Notation
$$\enclose{circle}{\text{Circled}}$$

$$\enclose{box}{\text{Boxed}}$$

$$\enclose{updiagonalstrike}{\text{Strike through}}$$

$$\enclose{horizontalstrike}{\text{Line through}}$$

$$\enclose{roundedbox}{\text{Rounded box}}$$

## Extended Arrows

### Long Arrows with Text
$$\xrightarrow{n \to \infty} \infty$$

$$\xleftarrow{\text{back}} A$$

$$\xRightarrow{n > 0} B$$

$$\xLeftarrow{?} C$$

$$\xleftrightarrow{\text{both ways}} D$$

$$\xhookrightarrow{\text{injection}} E$$

$$\xmapsto{f} F$$

## AMSarray

### Array with Alignment
$$\begin{array}{c|c}
a & b \\
\hline
c & d
\end{array}$$

## Equation Numbering and Labels

$$e=mc^2 \tag{Einstein}$$

$$\begin{align}
a &= b \tag{1}\\
c &= d \tag{2}
\end{align}$$

## Mathtools Features

### Underbrace and Overbrace
$$\underbrace{a + b + c}_{n \text{ terms}}$$

$$\overbrace{1 + 1 + \cdots + 1}^{n}$$

### Underline and Overline
$$\underline{important}$$

$$\overline{x}$$

### Matrix Delimiters
$$\begin{pmatrix} a & b \\ c & d \end{pmatrix}$$

$$\begin{bmatrix} a & b \\ c & d \end{bmatrix}$$

$$\begin{vmatrix} a & b \\ c & d \end{vmatrix}$$

$$\begin{Vmatrix} a & b \\ c & d \end{Vmatrix}$$

$$\begin{smallmatrix} a & b \\ c & d \end{smallmatrix}$$

## Upgreek Extension

### Upright Greek Letters
$$\alpha \beta \gamma \delta$$

$$\upalpha \upbeta \upgamma \updelta$$

## Mhchem Integration

$$\ce{H2O}$$

$$\ce{2H2 + O2 -> 2H2O}$$

$$\ce{[AgCl2]-}$$

## Define Custom Commands

$$\def\RR{\mathbb{R}} \RR$$

$$\newcommand{\NN}{\mathbb{N}} \NN$$

## Text and Spacing

### Text Mode
$$\text{if } x > 0$$

$$x \in \mathbb{R}$$

### Various Spaces
$$a \quad b$$
$$a \qquad b$$
$$a \, b$$
$$a \: b$$
$$a \; b$$

## Special Functions and Operators

### Limits
$$\lim_{x \to 0} \frac{\sin x}{x} = 1$$

$$\sum_{i=1}^{n} i = \frac{n(n+1)}{2}$$

$$\prod_{i=1}^{n} i = n!$$

### Integrals
$$\int_0^\pi \sin x \, dx = 2$$

$$\iint_D f(x,y) \, dA$$

## Equation Environments Summary

### Unnumbered Equations
$$x = y$$

### Split Environment
$$\begin{split}
f(x) &= (x+1)^2 \\
&= x^2 + 2x + 1
\end{split}$$

### Aligned Environment
$$\begin{aligned}
a &= b \\
c &= d
\end{aligned}$$

## Advanced Array Features

### Array with Multiple Columns
$$\begin{array}{lrcl}
\text{minimize} & \quad c^T x \\
\text{subject to} & \quad Ax &\leq & b \\
& \quad x &\geq & 0
\end{array}$$

## Fractions and Stacking

### Continued Fractions
$$\cfrac{1}{1 + \cfrac{1}{2 + \cfrac{1}{3}}}$$

### Binomial Coefficients
$$\binom{n}{k} = \frac{n!}{k!(n-k)!}$$

### Stacked Operation
$$\stackrel{\text{def}}{=}$$

## Unicode and Symbols

### Extended Symbols
$$\infty, \emptyset, \nabla, \partial, \heartsuit$$

$$\aleph_0, \beth_1, \wp, \Re, \Im$$

## Combining Multiple Features

### Complex Expression
$$\boxed{\text{The answer is } {\color{red} 42}}$$

$$\frac{\enclose{circle}{a + b}}{{\color{blue} c + d}}$$

$$\left\lbrace \begin{array}{l}
{\color{green} x + y = 1} \\
{\color{purple} 2x - y = 2}
\end{array} \right.$$
