import os


def env_loads(file: str) -> bool:
    """
    Loads environment variables from the specified file.

    Args:
        file (str): Path to the environment file.

    Returns:
        bool: True if the environment variables were successfully loaded,
        False otherwise.
    """
    try:
        with open(file, "r") as env:
            # Iterate through each line in the environment file
            for line in env:
                # Uncomment the next line if you want to see each line being processed
                # print(line)

                # Split the line into key and value based on the first '=' encountered
                key, value = line.strip().split("=", 1)

                # Set the environment variable
                os.environ[key] = value

        # Return True to indicate successful loading of environment variables
        return True

    except FileNotFoundError:
        # Handle the case where the specified file is not found
        print("File not found")
        return False

    except Exception as e:
        # Handle any other exceptions that may occur during file reading or
        # variable setting
        print("An error occurred: ", e)
        return False


if __name__ == "__main__":
    # Example usage: Load environment variables from the specified file
    env_loads("../.env")
