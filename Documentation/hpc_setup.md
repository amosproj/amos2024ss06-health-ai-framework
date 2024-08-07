# 💻 Setting Up Your Project in FAU's HPC Environment

This guide will help you set up your project on FAU's High-Performance Computing system.


## 🔑 Creating SSH Key and Adding it to Your HPC Account

To access FAU's High-Performance Computing (HPC) system, you'll need to create an SSH key pair and add the public key to your HPC account. Follow the steps outlined in the [SSH Command Line documentation](https://doc.nhr.fau.de/access/ssh-command-line/) provided by FAU.

Once you've completed these steps, you should be able to log in to the HPC system securely using SSH without entering your password each time.


## 💻 Connecting to Tiny GPU

```bash
ssh tinyx.nhr.fau.de
```

Once the connection is successfully made, terminal prompt will change to something like this:

```bash
YOUR_HPC_USER_NAME@tinyx:~$
```


## 🔧 Loading Modules in the Shell

To **make Python 3.10 available** in your shell for project, you can use the following command:

```bash
module add python/3.10-anaconda
```


## 🧰 Installing PDM for Your Project

To **install PDM**, which is a dependency for project, you can use the following command:

```bash
curl -sSL https://pdm-project.org/install-pdm.py | python3 -
```

To **make PDM executable** from your terminal, you can use the following command:

```bash
export PATH=/home/hpc/amos/$(whoami)/.local/bin:$PATH
```


## 📦 Making Modules and PDM Available System-wide

To ensure that the **required modules and PDM are available system-wide** without needing to manually add them each time, follow these steps:

1. Navigate to your **home directory** (`~`) using the following command:
   
   ```bash
   cd ~
   ```

2. **Create** a `.bash_login` file if it doesn't already exist:
   
   ```bash
   touch .bash_login
   ```

3. **Open** the `.bash_login` file in a text editor of your choice:
   
   ```bash
   nano .bash_login
   ```

4. **Add** the following lines to the `.bash_login` file:
   
   ```bash
   module add python/3.10-anaconda
   export PATH=/home/hpc/amos/$(whoami)/.local/bin:$PATH
   ```

5. **Save and close** the file (`Ctrl + O`, then `Enter`, followed by `Ctrl + X` in nano).

6. To **apply the changes**, either restart your terminal or run the following command:
   
   ```bash
   source ~/.bash_login
   ```

Now, the required modules and PDM will be automatically loaded whenever you open a new terminal session, making them readily available for your project.

## 👤 Creating a shared folder

1. Adding a read permission to your own `$WORK` directory for our `amos` group .
   ```bash
   chmod g+x $WORK
   ```
2. Creating a shared folder inside `$WORK` where we can store shared resources.
   ```bash
   cd $WORK
   mkdir ./shared
   ```
3. Letting the folder `./shared` to be accessible for other team members.
   ```bash
   chmod -R g+rwx $WORK/shared
   ```
   
4. Ensure that newly created files within `./shared` inherit the same permissions.
   ```bash
   chmod g+s $WORK/shared
   ```
5. Checking if the permissions were applied correctly. The output should look similar.
   ```bash
   ll -a
   drwxrwxr-x 1 amos103h amos 16 May 11 16:10 shared
   ```

- `$WORK` directory has the capacity of 500 GB but has no backups / snapshots.
- `$HOME` directory has the capacity of 50 GB but is backed up regularly.

## 🚀 Building Apptainer Container with Singularity

### 🛠️ Building the Container

Use the following command to build the Singularity container:

```bash
singularity build Apptainer.sif Apptainer.def
```

### 🏃‍♂️ Running the Container

Once the container is built, you can run it using the following command:

```bash
singularity shell Apptainer.sif
```

This command opens a shell within the container, allowing you to interact with its environment.
