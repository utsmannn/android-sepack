<h1 align="center">
  Android Sepack
</h1>

<p align="center">
  <img src="https://images.unsplash.com/photo-1511854289476-81c95d2a62c6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80"/>
</p>

<p align="center">
  <a href="LICENSE"><img alt="License" src="https://img.shields.io/badge/License-Apache%202.0-blue.svg"></a>
  <a href="https://github.com/utsmannn/sepack/pulls"><img alt="Pull request" src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat"></a>
  <a href="https://twitter.com/utsmannn"><img alt="Twitter" src="https://img.shields.io/twitter/follow/utsmannn"></a>
  <a href="https://github.com/utsmannn"><img alt="Github" src="https://img.shields.io/github/followers/utsmannn?label=follow&style=social"></a>
  <h3 align="center">Tool for generate android project base on MVVM</h3>
</p>

<p align="center">
  <img src="https://i.ibb.co/6gSy73S/ezgif-com-video-to-gif-2.gif"/>
</p>

---

### Setup
#### Mac os
```
brew tap utsmannn/android-sepack
brew install sepack
```

#### Windows
```
Under maintenance..
```

#### Manual
```
wget -P android-sepack https://raw.githubusercontent.com/utsmannn/android-sepack/master/sepack
```

#### Make executable
```
cd android-sepack
chmod +x ./sepack
```

#### Add to path zsh (Mac os)
Open .zprofile with terminal
```
vim .zprofile
```

And type (press i for editable vim)
```
export PATH=~/android-sepack:$PATH
```
(for quit vim, press esc and type :wq)

Restart terminal

### Usage
For start create project
```
sepack init
```

### Repo Template
- [Basic](https://github.com/utsmannn/sepack-basic)
- [Basic With Glide](https://github.com/utsmannn/sepack-basic-glide)
- [Basic RecyclerView](https://github.com/utsmannn/sepack-basic-recyclerview)
- and others will available..

### Main Tech Stack
- MVVM
- Result case pattern
- Coroutine flow

---

```
Copyright 2020 Muhammad Utsman

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```