
# Fenced Code Block 2

A fenced code block can have a [info-string](https://spec.commonmark.org/0.31.2/#fenced-code-blocks:~:text=The%20line%20with%20the%20opening%20code%20fence%20may%20optionally%20contain%20some%20text%20following%20the%20code%20fence%3B%20this%20is%20trimmed%20of%20leading%20and%20trailing%20spaces%20or%20tabs%20and%20called%20the%20info%20string). This information can be used for highlighting.

``````
```c++ title=main.cpp startline=3 
// 
// code
// 
```
``````

## Syntax

The first word of the `info_string` is used to specify the language. The code will be syntax-highlighted with highlight.js.

If a tag `{xxx}` is used instead of a language, a different renderer will be used. The list of supported tags are listed somewhere else.

- `title="main.cpp"` : sets title tag. 
- `startline=3`: sets start line
- `{main.cpp:10}`: sets title and line number




## Example

c++ title=main.cpp

```c++ title=main.cpp
#include <iostream>
using namespace std;

int main(int argc, char* argv[])
{
    // hello
    cout << "Hello World!" << endl;
    
    return 0;
}
```

c++ title=main.cpp linestart=1

```c++ title=main.cpp linestart=1
#include <iostream>
using namespace std;

int main(int argc, char* argv[])
{
    // hello
    cout << "Hello World!" << endl;
    
    return 0;
}
```

c++ {main.cpp:1}

```c++ {main.cpp:1}
#include <iostream>
using namespace std;

int main(int argc, char* argv[])
{
    // hello
    cout << "Hello World!" << endl;
    
    return 0;
}
```